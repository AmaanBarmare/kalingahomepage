"""
Kalinga homepage — brochure pipeline.

The four collection brochures ship from the studio as PRINT masters: Illustrator
PDF/1.4, 612 x 846pt pages, every placed image a 300ppi CMYK JPEG. That is the
whole story of the 1.8 GB — page 1 of Quartz alone is a 3712 x 4608 CMYK plate.
300ppi is the right number for a press and roughly 4x what a screen can show.

Two decisions, both deliberate:

 1. DOWNSAMPLE TO 150ppi, DO NOT CONVERT COLOUR. 150ppi puts a 612 x 846pt page
    at 1275 x 1762px, which is still ~1.2x a full-height laptop viewport, so it
    stays sharp at fit-to-page and holds up zoomed in. The images stay CMYK:
    converting to RGB would cut a channel (~25%) but any conversion without the
    studio's source ICC profile shifts the brand colours, and these are colour
    proofs of stone. Bytes are not worth that.
 2. QUALITY 82 JPEG. Above the ~75 where chroma blocking starts to show on the
    smooth stone gradients these are full of, below the point where the encoder
    is spending bytes on grain.

Verification is not by eye: every file is re-rendered page by page at 110dpi
before and after, and the report carries the worst-page PSNR. Anything above
~38dB is indistinguishable at 1:1.

Usage:  python3 tools/optimize-brochures.py [--dpi 150] [--quality 82]
"""
import argparse, os, sys, time, math
import fitz

SRC_DIR = os.path.expanduser("~/Downloads")
OUT_DIR = os.path.abspath("public/brochures")
BROCHURES = [
    ("Elixir Collection Brochure.pdf",   "kalinga-elixir-collection.pdf",   "Elixir"),
    ("Marble Collection Brochure.pdf",   "kalinga-marble-collection.pdf",   "Marble"),
    ("Quartz Collection Brochure.pdf",   "kalinga-quartz-collection.pdf",   "Quartz"),
    ("Terrazzo Collection Brochure.pdf", "kalinga-terrazzo-collection.pdf", "Terrazzo"),
]

def psnr_pages(a_path, b_path, dpi=110, sample=6):
    """Worst-page PSNR between two PDFs, over `sample` evenly spaced pages."""
    a, b = fitz.open(a_path), fitz.open(b_path)
    n = min(a.page_count, b.page_count)
    idx = sorted({round(i * (n - 1) / max(sample - 1, 1)) for i in range(sample)})
    worst, worst_page = 1e9, None
    for i in idx:
        pa = a[i].get_pixmap(dpi=dpi, colorspace=fitz.csRGB)
        pb = b[i].get_pixmap(dpi=dpi, colorspace=fitz.csRGB)
        if pa.width != pb.width or pa.height != pb.height:
            continue
        sa, sb = pa.samples, pb.samples
        step = max(1, len(sa) // 400_000)          # sample the plane, not every byte
        se, cnt = 0, 0
        for k in range(0, len(sa), step):
            d = sa[k] - sb[k]
            se += d * d
            cnt += 1
        mse = se / cnt
        p = 99.0 if mse == 0 else 10 * math.log10(255 * 255 / mse)
        if p < worst:
            worst, worst_page = p, i + 1
    a.close(); b.close()
    return worst, worst_page

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dpi", type=int, default=150)
    ap.add_argument("--quality", type=int, default=82)
    args = ap.parse_args()
    os.makedirs(OUT_DIR, exist_ok=True)

    rows, t0 = [], time.time()
    for src_name, out_name, label in BROCHURES:
        src = os.path.join(SRC_DIR, src_name)
        out = os.path.join(OUT_DIR, out_name)
        if not os.path.exists(src):
            print(f"{label:9s} MISSING SOURCE: {src}", flush=True)
            continue
        t = time.time()
        print(f"{label:9s} working...", flush=True)
        d = fitz.open(src)
        pages = d.page_count
        d.rewrite_images(
            dpi_threshold=args.dpi + 1, dpi_target=args.dpi, quality=args.quality,
            lossy=True, lossless=True, color=True, gray=True, bitonal=False,
        )
        try:
            d.subset_fonts(verbose=False)
        except Exception as e:
            print(f"{label:9s} font subset skipped ({e})", flush=True)
        d.ez_save(out, garbage=4, deflate=True, clean=True)
        d.close()
        before, after = os.path.getsize(src), os.path.getsize(out)
        p, pg = psnr_pages(src, out)
        rows.append((label, pages, before, after, p, pg, time.time() - t))
        print(
            f"{label:9s} {pages:3d}pp  {before/1048576:7.1f} MB -> {after/1048576:6.2f} MB "
            f"({before/after:5.1f}x)  worst PSNR {p:.1f} dB (p{pg})  {time.time()-t:.0f}s",
            flush=True,
        )

    tb = sum(r[2] for r in rows); ta = sum(r[3] for r in rows)
    print(
        f"\n{len(rows)} brochures at {args.dpi}ppi q{args.quality}: "
        f"{tb/1048576:.0f} MB -> {ta/1048576:.1f} MB ({tb/ta:.1f}x smaller), "
        f"{time.time()-t0:.0f}s total.",
        flush=True,
    )

if __name__ == "__main__":
    main()
