"""
Kalinga homepage — generative-watermark removal.

Strips the Gemini sparkle from a raw clip by INVERTING the composite that put
it there, rather than by painting over it. Run this before tools/optimize-video.mjs;
it turns a raw in assets-src/video into the `-clean.mkv` that the video pipeline
takes as its source.

    python3 tools/dewatermark.py hero-cmc-v2-raw.mp4

WHY NOT INPAINT. The obvious move — mask the mark and interpolate — is what the
first CMC hero had to resort to, and it is why that clip was cropped to
1120x630 and scaled back up: interpolating a 61x49 patch leaves visible smears
whenever the mark crosses a marble vein, and dropping 12.5% of the frame was
cheaper than living with them. Neither is necessary. The mark is ONE STATIC
RGBA OVERLAY composited onto the finished render, so every frame carries

    obs = (1 - a) * orig + a * C

with the same per-pixel alpha `a` and the same overlay colour `C`. Recover
those two constants and `orig` follows exactly. Nothing is invented, nothing is
smeared, and the full-resolution frame survives intact.

HOW THE CONSTANTS ARE RECOVERED.

  1. seed    A static bright shape is exactly what survives temporal averaging,
             so it stands proud of a local median of the mean frame. Largest
             connected blob wins; marble speckle does not survive the median.

  2. fit     Least squares for `a` over all frames, using a per-frame border
             inpaint as the stand-in for `orig`. Any single inpaint is wrong in
             detail, but it is unbiased, and a few hundred of them average that
             error away. The inpaint NEVER supplies an output pixel — it only
             helps locate a constant. That is the whole difference between this
             and inpainting the frames.

  3. refine  Step 2's regressor is itself noisy, and noise in a regressor biases
             the slope toward zero (regression dilution). Under-estimated alpha
             leaves a faint rim at the mark's anti-aliased edge — visible at 4x
             on a still. So iterate on the one criterion that actually defines
             success: after inversion the TEMPORAL MEAN must be locally smooth,
             because a static mark is precisely what averaging preserves. Each
             pass measures the leftover static residual and folds it back into
             `a`. Watch `rms-resid` fall to the noise floor; on the CMC v2 hero
             it goes 17.88 -> 0.30 levels, a 60x reduction, and the peak drops
             from 41.03 to 3.11.

  4. invert  orig = (obs - a*C) / (1 - a), written out as lossless FFV1 so the
             encoder sweep downstream starts from clean pixels. `a` peaks near
             0.36, so the division amplifies coding noise by at most ~1.6x over
             the 61x49 patch and nowhere else in the frame.

VERIFY IT WORKED. The script prints a full-frame scan of the result: the peak
static residual and the hottest 16x16 cells. Before the fix the hot list is the
mark, contiguous and dominant. After, it must be scattered scene content with a
much lower peak — that is the check that the mark is gone AND that there was
only one of them.

Requires numpy + opencv-python (`pip install opencv-python`), and ffmpeg on PATH.
"""

import os
import subprocess
import sys

import cv2
import numpy as np

RAW_DIR = os.environ.get("RAW_DIR", os.path.join("assets-src", "video"))
ITERS = 6
# Fit domain around the mark. Generous on purpose: the inpaint that feeds the
# least squares must draw from clean pixels, so its borders have to sit well
# clear of the mark's soft edge.
PAD = 40


def frames_of(path):
    cap = cv2.VideoCapture(path)
    if not cap.isOpened():
        sys.exit(f"cannot open {path}")
    fps = cap.get(cv2.CAP_PROP_FPS)
    out = []
    while True:
        ok, f = cap.read()
        if not ok:
            break
        out.append(f)
    cap.release()
    return out, fps


def static_residual(img):
    """What survives temporal averaging: the image minus a local median of
    itself. A 61x49 overlay cannot survive a 41px median; scene content can."""
    g = np.clip(img, 0, 255).astype(np.uint8)
    b = np.stack([cv2.medianBlur(g[:, :, c], 41) for c in range(3)], axis=2)
    return img - b.astype(np.float64), b.astype(np.float64)


def scan(mean_img, label):
    """Full-frame hunt for static overlays — catches a second mark if one exists."""
    g = mean_img.mean(axis=2)
    b = cv2.medianBlur(np.clip(g, 0, 255).astype(np.uint8), 41).astype(np.float64)
    r = np.abs(g - b)
    h, w = r.shape
    ph, pw = h // 16, w // 16
    pooled = r[: ph * 16, : pw * 16].reshape(ph, 16, pw, 16).max(axis=(1, 3))
    hot = np.dstack(np.unravel_index(np.argsort(pooled.ravel())[::-1][:6], pooled.shape))[0]
    cells = ", ".join(f"({c * 16},{rr * 16})@{pooled[rr, c]:.1f}" for rr, c in hot)
    print(f"  {label:<8} peak {r.max():6.2f}  rms {np.sqrt((r ** 2).mean()):.3f}   hot cells: {cells}")


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__.strip().splitlines()[3].strip())
    name = sys.argv[1]
    src = name if os.path.exists(name) else os.path.join(RAW_DIR, name)
    if not os.path.exists(src):
        sys.exit(f"no raw at {src}")
    stem = os.path.splitext(os.path.basename(src))[0].removesuffix("-raw")
    out = os.path.join(RAW_DIR, f"{stem}-clean.mkv")

    frames, fps = frames_of(src)
    T = len(frames)
    H, W = frames[0].shape[:2]
    print(f"{os.path.basename(src)}  {T} frames  {W}x{H} @ {fps:g}fps")

    full_mean = np.mean([f.astype(np.float64) for f in frames], axis=0)
    print("static-overlay scan:")
    scan(full_mean, "before")

    # ---- 1. seed the footprint from the whole-frame mean
    g = full_mean.mean(axis=2)
    b = cv2.medianBlur(np.clip(g, 0, 255).astype(np.uint8), 41).astype(np.float64)
    seed = ((g - b) > 1.5).astype(np.uint8)
    seed = cv2.morphologyEx(seed, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))
    n, lab, stats, _ = cv2.connectedComponentsWithStats(seed, 8)
    if n <= 1:
        sys.exit("no static overlay found — nothing to remove")
    k = 1 + int(np.argmax(stats[1:, cv2.CC_STAT_AREA]))
    seed = (lab == k).astype(np.uint8)
    ys, xs = np.nonzero(seed)
    print(
        f"footprint x {xs.min()}..{xs.max()}  y {ys.min()}..{ys.max()}"
        f"  ({xs.max() - xs.min() + 1}x{ys.max() - ys.min() + 1})"
    )

    X0, Y0 = max(xs.min() - PAD, 0), max(ys.min() - PAD, 0)
    X1, Y1 = min(xs.max() + PAD + 1, W), min(ys.max() + PAD + 1, H)
    obs = np.array([f[Y0:Y1, X0:X1].astype(np.float64) for f in frames])

    mask = cv2.dilate(seed[Y0:Y1, X0:X1], np.ones((11, 11), np.uint8))
    mask3 = np.repeat(mask[:, :, None], 3, axis=2).astype(bool)

    # ---- 2. least squares against per-frame inpaints
    print(f"fitting over {T} frames ...")
    inp = np.array(
        [cv2.inpaint(obs[t].astype(np.uint8), mask, 6, cv2.INPAINT_NS).astype(np.float64) for t in range(T)]
    )
    d = 255.0 - inp
    a = np.clip(((obs - inp) * d).sum(0) / np.maximum((d * d).sum(0), 1e-9), 0.0, 0.95)
    a = np.repeat(a.mean(axis=2, keepdims=True), 3, axis=2)
    a[~mask3] = 0.0

    core = a[:, :, 0] > 0.03
    w = a[:, :, 0][core][:, None]
    C = sum(((inp[t][core] + (obs[t] - inp[t])[core] / w) * w).sum(0) for t in range(T)) / (T * w.sum())
    print(f"overlay colour BGR {C.round(1)}   alpha max {a.max():.3f}   px {int(core.sum())}")
    C = C.reshape(1, 1, 3)

    def invert(alpha):
        return (obs - alpha * C) / np.maximum(1.0 - alpha, 0.05)

    # ---- 3. refine until the static residual stops shrinking
    R, _ = static_residual(obs.mean(0))
    print(f"  {'iter':>5}  {'peak':>8}  {'rms':>8}  {'alpha max':>9}")
    print(f"  {'raw':>5}  {np.abs(R[mask3]).max():8.2f}  {np.sqrt((R[mask3] ** 2).mean()):8.2f}  {'--':>9}")
    for it in range(ITERS):
        rec = invert(a)
        R, B = static_residual(rec.mean(0))
        print(
            f"  {it:>5}  {np.abs(R[mask3]).max():8.2f}  "
            f"{np.sqrt((R[mask3] ** 2).mean()):8.2f}  {a.max():9.3f}"
        )
        da = R * (1.0 - a) / np.maximum(C - B, 1.0)  # leftover mark -> leftover alpha
        da[~mask3] = 0.0
        a = np.clip(a + da, 0.0, 0.95)
    a[a < 0.004] = 0.0
    rec = invert(a)

    # ---- 4. write the lossless intermediate
    for t in range(T):
        frames[t][Y0:Y1, X0:X1] = np.clip(np.rint(rec[t]), 0, 255).astype(np.uint8)
    print("static-overlay scan:")
    scan(np.mean([f.astype(np.float64) for f in frames], axis=0), "after")

    p = subprocess.Popen(
        # fmt: off
        ["ffmpeg", "-y", "-v", "error", "-f", "rawvideo", "-pix_fmt", "bgr24",
         "-s", f"{W}x{H}", "-r", str(fps), "-i", "-",
         "-c:v", "ffv1", "-level", "3", "-pix_fmt", "bgr0", out],
        # fmt: on
        stdin=subprocess.PIPE,
    )
    for f in frames:
        p.stdin.write(f.tobytes())
    p.stdin.close()
    if p.wait() != 0:
        sys.exit("ffmpeg failed writing the clean master")
    print(f"wrote {out}  {os.path.getsize(out) / 1e6:.1f} MB (lossless)")


if __name__ == "__main__":
    main()
