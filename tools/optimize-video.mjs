/**
 * Kalinga homepage — video pipeline.
 *
 * Reads the raw clips from assets-src/video and writes a WebM (VP9) + MP4
 * (H.264) pair plus a WebP poster into public. Same two rules as the image
 * pipeline (tools/optimize-assets.mjs), for the same reasons:
 *
 *  1. NEVER upscale. Both clips are emitted at their source resolution. The
 *     hero's 1280x720 lands UNDER 1x for its 1440-wide box; that is a request
 *     to make of whoever renders the clips, not something to paper over with a
 *     resample. `--audit` reports the shortfall.
 *  2. Settings are DERIVED from a measured sweep, not picked by feel. On the
 *     hero, SSIM against its own master moved 0.9915 -> 0.9876 across crf
 *     18..24 — 0.4% for 2x the bytes — so the knee sits well below the default.
 *     The visualiser is a far more detailed render and needs its own numbers:
 *     at the hero's crf its MP4 came out LARGER than the source file.
 *
 *     Swept against the 3754 KB master, PSNR frame-aligned (see the warning
 *     below), the visualiser's curve is:
 *
 *       vp9  crf 24  2324 KB  47.26 dB      h264 crf 21  3048 KB  48.98 dB
 *            crf 26  1972 KB  46.53 dB           crf 22  2728 KB  48.06 dB
 *            crf 28  1718 KB  45.93 dB           crf 23  2413 KB  47.17 dB
 *            crf 30  1510 KB  45.37 dB           crf 25  1876 KB  45.63 dB
 *            crf 34  1114 KB  44.07 dB
 *
 *     There is no knee — it is close to linear — so this is a budget call, and
 *     the budget is set by what the picture does. At crf 34, which is what used
 *     to ship, the rug weave in the middle of frame 150 goes visibly soft; by
 *     crf 24 that crop is 44.2 dB and matches the master by eye. So vp9 24, and
 *     h264 23 to MATCH IT rather than to match its size: 47.17 against 47.26,
 *     so Safari and Chrome get the same picture. Both land under the master.
 *
 *     Tuning the VP9 args instead of the crf buys nothing: cpu-used 1 with
 *     auto-alt-ref 6, lag-in-frames 25 and tile-columns 2 gave 47.87 dB for
 *     2790 KB, which is where plain crf 22 already sits. Same curve, more
 *     wall-clock. The args below stay as they are.
 *
 *     MEASURE PSNR/SSIM WITH THE TIMEBASE NORMALISED — `[0:v]settb=AVTB,
 *     setpts=N` on both inputs. Without it ffmpeg silently pairs frames by
 *     timestamp, and the WebM's timing made VP9 read 8.7dB worse than it is
 *     (38.5 vs 47.3), which is enough to pick the wrong codec entirely.
 *
 * Three things this fixes that are invisible until you measure them.
 *
 * WATERMARK (hero). A Gemini sparkle sits at x1137..1182 y576..622 (46x47,
 * inset 97px from both the right and bottom edges). It is a constant white
 * composite: solving it per-pixel across all 240 frames gives alpha
 * [0.315, 0.314, 0.315] over RGB — equal across channels, i.e. a neutral
 * overlay, which is what makes the solve trustworthy — peaking at 0.37 over
 * [241.2, 239.2, 235.9]. Un-blending that recovers the true marble, but the
 * glyph's anti-aliased edge cannot be pinned precisely enough and leaves a
 * visible rim. delogo measures better: it drops the region's mean temporal
 * residual to 0.05 against a clean-marble floor of 7.73, an order of magnitude
 * BELOW the surrounding noise. It interpolates rather than recovers, but the
 * marble there carries only 2.24 levels RMS of high-frequency detail, so there
 * is nothing to lose.
 *
 * THE VISUALISER SHIPS AS DELIVERED — no trim, no retime, no fold. That is a
 * deliberate reversal and both halves of it were tried first, so the reasons
 * are worth keeping.
 *
 * The master is 300 frames at 30fps, but only 228 of them move. Measured at
 * full resolution: frames 0..22 are frozen (frame 0 vs 22 is 59.8dB, max
 * channel delta 9), frames 251..299 are frozen (250 vs 299 is 71.3dB, delta 3),
 * and motion runs 23..250 — frame 23 breaks from frame 0 at 45.4dB / 210. So
 * 2.40s of the 10 is a still frame, at both ends, where a loop can least afford
 * it, and 58 frozen transitions survive inside the cut including a 0.6s stall
 * at frame 165.
 *
 * Trimming those and folding the tail gave 6.80s, which read as rushed.
 * Retiming that back up to 8.00s through minterpolate's motion-compensated mode
 * fixed the pace and cost picture quality — synthesised frames are only as good
 * as the motion estimate, and on this render they were not good enough.
 *
 * Between a clip that is paced wrong and one that is soft, the client's call
 * was the master's own timing. So `keep`, `retime` and `fade` are all off here
 * and every bit goes to the encode instead. What that accepts, on the record:
 * a ~1.6s stall before each loop, and a restart that jumps ~17x a normal frame
 * delta because nothing smooths the seam. Both are properties of the delivered
 * file. The fix for either is a better master, not a better pipeline.
 *
 * LOOP SEAM (both). Neither clip loops as delivered: the hero's last->first
 * jump is 21x a typical frame delta, the visualiser's 17x. Both are fixed by
 * folding the tail back over the head —
 *     O(t) = orig(t)*(t/X) + orig(t+L)*(1 - t/X)   for t < X
 *     O(t) = orig(t)                               for t >= X
 * with L = N - X, which makes the loop point continuous by construction. That
 * takes the hero to 0.7x and the visualiser to 1.4x, i.e. the wrap is now no
 * more visible than an ordinary frame transition.
 *
 * Usage:  node tools/optimize-video.mjs [--audit]
 */
import { spawn } from "node:child_process";
import sharp from "sharp";
import { mkdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const RAW_DIR = process.env.RAW_DIR ?? path.resolve("assets-src/video");
const VIDEO_OUT = path.resolve("public/videos");
const POSTER_OUT = path.resolve("public/images");
const AUDIT = process.argv.includes("--audit");
const POSTER_QUALITY = 82; // transient, so below the plates' 90

/**
 * `display` is the CSS box the clip occupies in the 1440px Figma frame.
 * `pre`    — filters applied to the source before anything else.
 * `keep`   — [startFrame, endFrame) of the source to retain.
 * `retime` — frame count to stretch the kept range to, before the fold. null
 *            leaves the clip at native speed.
 * `fade`   — crossfade length in frames used to close the loop.
 */
const CLIPS = [
  {
    src: "hero-raw.mp4",
    out: "hero",
    poster: "hero-poster.webp",
    display: [1440, 1071], // 544:4024 — aspect 1.345 vs the clip's 1.778
    pre: ["delogo=x=1132:y=571:w=57:h=57"], // measured bbox + ~5px margin
    keep: null, // no dead frames; median delta 3.47, zero frozen transitions
    retime: null, // 10s of unbroken motion in, 9.00s out — native speed is fine
    fade: 24, // 1.0s at 24fps
    crf: { h264: 23, vp9: 31 },
    note: "8-shot montage, cross-dissolved — loops",
  },
  {
    src: "visualiser-raw.mp4",
    out: "visualiser",
    poster: "visualiser-poster.webp",
    display: [1440, 815], // 544:4015 — aspect 1.767 vs the clip's 1.778, near-exact
    pre: [],
    keep: null, // ship the master's own timeline — see the note above
    retime: null,
    fade: 0, // no fold: the loop seam is the master's, untouched
    crf: { h264: 23, vp9: 24 }, // quality-matched at ~47.2dB; see the sweep above
    note: "slow dolly push-in — loops",
  },
];

const run = (cmd, args) =>
  new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: ["ignore", "ignore", "pipe"] });
    let err = "";
    p.stderr.on("data", (d) => (err += d));
    p.on("close", (code) =>
      code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}\n${err.slice(-2000)}`)),
    );
  });

// ffmpeg has no libwebp in this build, so the poster comes off a pipe as PNG
// and sharp does the WebP encode — the same encoder the plates go through.
const runCapture = (cmd, args) =>
  new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: ["ignore", "pipe", "pipe"] });
    const chunks = [];
    let err = "";
    p.stdout.on("data", (d) => chunks.push(d));
    p.stderr.on("data", (d) => (err += d));
    p.on("close", (code) =>
      code === 0
        ? resolve(Buffer.concat(chunks))
        : reject(new Error(`${cmd} exited ${code}\n${err.slice(-2000)}`)),
    );
  });

const probe = async (file) => {
  const p = spawn("ffprobe", [
    "-v", "error",
    "-select_streams", "v:0",
    "-count_frames",
    "-show_entries", "stream=width,height,r_frame_rate,nb_read_frames",
    "-show_entries", "format=duration",
    "-of", "json",
    file,
  ]);
  let out = "";
  p.stdout.on("data", (d) => (out += d));
  await new Promise((r) => p.on("close", r));
  const j = JSON.parse(out);
  return {
    ...j.streams[0],
    frames: Number(j.streams[0].nb_read_frames),
    duration: Number(j.format.duration),
  };
};

const kb = (n) => `${(n / 1024).toFixed(0)} KB`;

// ffprobe reports frame rate as a rational ("24/1")
const fps = (r) => {
  const [n, d] = String(r).split("/").map(Number);
  return d ? n / d : n;
};

/**
 * Trim, then fold the tail back over the head so the clip loops. Returns a
 * filter_complex whose final label is [v].
 */
const buildFilter = (clip, srcFrames, rate) => {
  const pre = clip.pre.length ? `${clip.pre.join(",")},` : "";
  const [ks, ke] = clip.keep ?? [0, srcFrames];
  const trim = clip.keep ? `trim=start_frame=${ks}:end_frame=${ke},setpts=PTS-STARTPTS,` : "";
  const kept = ke - ks;
  // `fade: 0` ships the timeline untouched — no fold, no split, nothing to
  // blend. Kept as a real branch because a zero-length crossfade would divide
  // by zero in the blend expression below.
  if (!clip.fade) return `[0:v]${pre}${trim}null[v]`;
  // Stretch time, then rebuild the timeline at the native rate. minterpolate
  // SYNTHESISES the in-between frames rather than repeating neighbours, which
  // is what keeps a 1.16x stretch from reading as judder.
  const retime = clip.retime
    ? `setpts=${(clip.retime / kept).toFixed(6)}*PTS,` +
      `minterpolate=fps=${rate}:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1,`
    : "";
  const n = clip.retime ?? kept; // frames the fold operates on
  const x = clip.fade;
  const l = n - x; // loop length

  return [
    `[0:v]${pre}${trim}${retime}split=3[a][b][c]`,
    `[a]trim=start_frame=0:end_frame=${x},setpts=PTS-STARTPTS[head]`,
    `[b]trim=start_frame=${l}:end_frame=${n},setpts=PTS-STARTPTS[tail]`,
    `[c]trim=start_frame=${x}:end_frame=${l},setpts=PTS-STARTPTS[body]`,
    `[head][tail]blend=all_expr='A*(N/${x})+B*(1-(N/${x}))'[open]`,
    `[open][body]concat=n=2:v=1:a=0[v]`,
  ].join(";");
};

if (!existsSync(RAW_DIR)) {
  console.error(`No raw video directory at ${RAW_DIR}`);
  process.exit(1);
}
await mkdir(VIDEO_OUT, { recursive: true });
await mkdir(POSTER_OUT, { recursive: true });

console.log(AUDIT ? "Auditing clips (no files written)\n" : "Building clips\n");

let total = 0;
for (const clip of CLIPS) {
  const src = path.join(RAW_DIR, clip.src);
  if (!existsSync(src)) {
    console.warn(`  skip ${clip.src} — not found`);
    continue;
  }
  const meta = await probe(src);
  const rate = fps(meta.r_frame_rate);
  const dpr = meta.width / clip.display[0];
  const srcAspect = meta.width / meta.height;
  const boxAspect = clip.display[0] / clip.display[1];
  // object-cover crops whichever axis has the surplus; report what is never seen
  const cropPct =
    srcAspect > boxAspect
      ? (1 - boxAspect / srcAspect) * 100
      : (1 - srcAspect / boxAspect) * 100;
  const [ks, ke] = clip.keep ?? [0, meta.frames];
  const outFrames = (clip.retime ?? ke - ks) - clip.fade;

  console.log(`${clip.out}  (${clip.note})`);
  console.log(
    `  source ${meta.width}x${meta.height} @ ${rate}fps  ${meta.frames} frames  ${meta.duration.toFixed(2)}s  ${kb((await stat(src)).size)}`,
  );
  console.log(
    `  box ${clip.display[0]}x${clip.display[1]}  ->  DPR ${dpr.toFixed(2)}x` +
      `${dpr < 2 ? "  (under 2x — needs a higher-res render)" : ""}`,
  );
  console.log(
    `  aspect ${srcAspect.toFixed(3)} vs box ${boxAspect.toFixed(3)}  ->  object-cover hides ${cropPct.toFixed(1)}% of the ${srcAspect > boxAspect ? "width" : "height"}`,
  );
  console.log(
    `  loop   ${clip.keep ? `keep ${ks}..${ke} then ` : ""}${
      clip.retime ? `retime ${ke - ks}->${clip.retime}f (${(clip.retime / (ke - ks)).toFixed(3)}x) then ` : ""
    }${clip.fade ? `fold ${clip.fade}f tail over head` : "master timeline untouched"}  ->  ${outFrames} frames (${(outFrames / rate).toFixed(2)}s)`,
  );

  if (AUDIT) {
    console.log("");
    continue;
  }

  const fc = buildFilter(clip, meta.frames, rate);
  const gop = String(Math.round(rate * 2)); // a keyframe every 2s
  const webm = path.join(VIDEO_OUT, `${clip.out}.webm`);
  const mp4 = path.join(VIDEO_OUT, `${clip.out}.mp4`);
  const poster = path.join(POSTER_OUT, clip.poster);

  // WebM / VP9 — the primary source.
  await run("ffmpeg", [
    "-y", "-v", "error", "-i", src,
    "-filter_complex", fc, "-map", "[v]", "-r", String(rate),
    "-c:v", "libvpx-vp9", "-crf", String(clip.crf.vp9), "-b:v", "0",
    "-row-mt", "1", "-cpu-used", "2", "-g", gop,
    "-pix_fmt", "yuv420p", "-an", webm,
  ]);

  // MP4 / H.264 — the fallback. faststart puts the moov atom first so the clip
  // starts before it has fully downloaded.
  await run("ffmpeg", [
    "-y", "-v", "error", "-i", src,
    "-filter_complex", fc, "-map", "[v]", "-r", String(rate),
    "-c:v", "libx264", "-preset", "slow", "-crf", String(clip.crf.h264),
    "-profile:v", "high", "-level", "4.0", "-g", gop,
    "-pix_fmt", "yuv420p", "-an", "-movflags", "+faststart", mp4,
  ]);

  // Poster = the clip's OWN first frame, not the Figma plate. A poster that
  // does not match frame 0 shows as a jump the moment the video starts. Capped
  // at the display width — it only has to hold until the first frame decodes.
  const frame0 = await runCapture("ffmpeg", [
    "-v", "error", "-i", src,
    "-filter_complex", fc, "-map", "[v]",
    "-frames:v", "1", "-f", "image2pipe", "-vcodec", "png", "-",
  ]);
  await sharp(frame0)
    .resize({ width: Math.min(meta.width, clip.display[0]), withoutEnlargement: true })
    .webp({ quality: POSTER_QUALITY, effort: 6 })
    .toFile(poster);

  const [w, m, p] = await Promise.all([stat(webm), stat(mp4), stat(poster)]);
  total += w.size + m.size + p.size;
  const srcSize = (await stat(src)).size;
  console.log(
    `  webm ${kb(w.size)}   mp4 ${kb(m.size)}   poster ${kb(p.size)}` +
      `   (webm is ${((1 - w.size / srcSize) * 100).toFixed(0)}% under source)`,
  );
  console.log("");
}

if (!AUDIT) console.log(`total shipped: ${(total / 1024 / 1024).toFixed(2)} MB`);
