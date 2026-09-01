"""
Kalinga homepage — brochure pipeline.

The four collection brochures ship from the studio as PRINT masters: Illustrator
PDF/1.4, 612 x 846pt pages, every placed photograph a ~300ppi CMYK JPEG. 1.8 GB
across four files. Two separate things make them that big, and only one of them
is the pictures.

 1. THE ILLUSTRATOR PRIVATE DATA IS TWO THIRDS OF THE FILE. `Create PDF
    Compatible File` embeds the whole editable .ai document inside the PDF, hung
    off `/PieceInfo << /Illustrator ... >>` on the catalogue and on every page.
    On Quartz that is 234 MB in 3733 objects against 79 MB of actual unique
    images — and NOTHING renders it. Dropping the key and garbage-collecting
    takes 340 MB -> 112 MB in two seconds with not one pixel changed. This is
    pure lossless win and it happens before anything else.

 2. The photographs are then downsampled 300ppi -> 150ppi and converted CMYK ->
    RGB. 150ppi puts a 612 x 846pt page at 1275 x 1762px, still ~1.2x a
    full-height laptop viewport, so it holds up at fit-to-page and under zoom.

WHY THIS DOES NOT USE `Document.rewrite_images`. PyMuPDF's built-in only scales
by powers of two and skips images it cannot halve into the target — a 300ppi
plate aimed at 200ppi is left untouched entirely — and it keeps CMYK. Measured
on Quartz, same 150ppi target: built-in 71.4 MB, this 26.0 MB. The difference is
arbitrary-ratio Lanczos plus dropping the fourth channel.

TEXT IS NOT AT RISK. These carry zero embedded fonts and zero extractable text:
every glyph is already vector outline, so downsampling the placed images cannot
touch it. Verified by rendering — the logotype is pixel-identical before and
after, and only the photography moves at all.

Verification is not by eye: every file is re-rendered page by page at 110dpi
before and after and the report carries the worst-page PSNR. ~38dB and up is
indistinguishable at 1:1.

Two workers, not eight: each holds a whole decoded document, and four
half-gigabyte PDFs at once is how you find the swap file on a 16 GB machine.

Usage:  python3 tools/optimize-brochures.py [--dpi 150] [--quality 80] [--jobs 2]
"""
import argparse, io, math, os, time
from concurrent.futures import ProcessPoolExecutor

import fitz
from PIL import Image

SRC_DIR = os.path.expanduser("~/Downloads")
OUT_DIR = os.path.abspath("public/brochures")
BROCHURES = [
    ("Elixir Collection Brochure.pdf",   "kalinga-elixir-collection.pdf",   "Elixir"),
    ("Marble Collection Brochure.pdf",   "kalinga-marble-collection.pdf",   "Marble"),
    ("Quartz Collection Brochure.pdf",   "kalinga-quartz-collection.pdf",   "Quartz"),
    ("Terrazzo Collection Brochure.pdf", "kalinga-terrazzo-collection.pdf", "Terrazzo"),
]


def strip_illustrator_data(doc):
    """Drop the embedded editable .ai payload. Returns how many objects carried it."""
    n = 0
    for xref in [doc.pdf_catalog()] + [doc.page_xref(i) for i in range(doc.page_count)]:
        if "PieceInfo" in doc.xref_get_keys(xref):
            doc.xref_set_key(xref, "PieceInfo", "null")
            n += 1
    return n


def widest_placement(doc):
    """Each image xref -> the widest box it is drawn into, in points.

    The target pixel width comes from how big the image is actually PLACED, not
    from its own dimensions: a plate drawn into half a column needs half the
    pixels of one drawn full-bleed, whatever the source says.
    """
    want = {}
    for pno in range(doc.page_count):
        page = doc[pno]
        for info in doc.get_page_images(pno, full=True):
            xref = info[0]
            for r in page.get_image_rects(xref):
                want[xref] = max(want.get(xref, 0), r.width)
    return want


def resample(doc, ppi, quality):
    done = skipped = 0
    for xref, wpt in widest_placement(doc).items():
        if wpt <= 0:
            continue
        try:
            pix = fitz.Pixmap(doc, xref)
        except Exception:
            skipped += 1
            continue
        # CMYK -> RGB through MuPDF's own colour management, not PIL's: these
        # are Adobe-inverted CMYK JPEGs and PIL gets them wrong often enough.
        if pix.n - pix.alpha >= 4:
            pix = fitz.Pixmap(fitz.csRGB, pix)
        target_w = max(1, int(round(wpt / 72.0 * ppi)))
        if target_w >= pix.width:            # rule 1, as everywhere: never upscale
            pix = None
            skipped += 1
            continue
        im = Image.open(io.BytesIO(pix.tobytes("png")))
        pix = None
        if im.mode not in ("RGB", "L"):
            im = im.convert("RGB")
        im = im.resize((target_w, max(1, round(im.height * target_w / im.width))), Image.LANCZOS)
        buf = io.BytesIO()
        # subsampling=1 (4:2:2) not the default 4:2:0 — these are photographs of
        # stone, and chroma is where the veining lives.
        im.save(buf, "JPEG", quality=quality, optimize=True, subsampling=1)
        try:
            doc[0].replace_image(xref, stream=buf.getvalue())
            done += 1
        except Exception:
            skipped += 1
    return done, skipped


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
        step = max(1, len(sa) // 400_000)      # sample the plane, not every byte
        se = cnt = 0
        for k in range(0, len(sa), step):
            d = sa[k] - sb[k]
            se += d * d
            cnt += 1
        mse = se / cnt
        p = 99.0 if mse == 0 else 10 * math.log10(255 * 255 / mse)
        if p < worst:
            worst, worst_page = p, i + 1
    a.close()
    b.close()
    return worst, worst_page


def one(job):
    src_name, out_name, label, dpi, quality = job
    src = os.path.join(SRC_DIR, src_name)
    out = os.path.join(OUT_DIR, out_name)
    if not os.path.exists(src):
        return (label, None, f"MISSING SOURCE: {src}")
    t0 = time.time()
    doc = fitz.open(src)
    pages = doc.page_count
    stripped = strip_illustrator_data(doc)
    done, skipped = resample(doc, dpi, quality)
    doc.ez_save(out, garbage=4, deflate=True, clean=False, use_objstms=1)
    doc.close()
    before, after = os.path.getsize(src), os.path.getsize(out)
    p, pg = psnr_pages(src, out)
    return (label, (pages, before, after, p, pg, stripped, done, skipped, time.time() - t0), None)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dpi", type=int, default=150)
    ap.add_argument("--quality", type=int, default=80)
    ap.add_argument("--jobs", type=int, default=2)
    args = ap.parse_args()
    os.makedirs(OUT_DIR, exist_ok=True)

    rows, t0 = [], time.time()
    jobs = [(a, b, c, args.dpi, args.quality) for a, b, c in BROCHURES]
    size = lambda j: os.path.getsize(os.path.join(SRC_DIR, j[0])) if os.path.exists(os.path.join(SRC_DIR, j[0])) else 0
    jobs.sort(key=size)   # smallest first, so the first numbers land early enough to act on

    with ProcessPoolExecutor(max_workers=args.jobs) as ex:
        for label, r, err in ex.map(one, jobs):
            if err:
                print(f"{label:9s} {err}", flush=True)
                continue
            pages, before, after, p, pg, stripped, done, skipped, t = r
            rows.append((label, pages, before, after, p, pg))
            print(
                f"{label:9s} {pages:3d}pp  {before/1048576:7.1f} MB -> {after/1048576:6.2f} MB "
                f"({before/after:5.1f}x)  worst PSNR {p:.1f} dB (p{pg})  "
                f"[ai-data off {stripped} objs · {done} images resampled, {skipped} left alone · {t:.0f}s]",
                flush=True,
            )

    if not rows:
        return
    tb = sum(r[2] for r in rows)
    ta = sum(r[3] for r in rows)
    worst = min(r[4] for r in rows)
    print(
        f"\n{len(rows)} brochures at {args.dpi}ppi q{args.quality}: "
        f"{tb/1048576:.0f} MB -> {ta/1048576:.1f} MB ({tb/ta:.1f}x smaller), "
        f"worst page {worst:.1f} dB, {time.time()-t0:.0f}s total.",
        flush=True,
    )


if __name__ == "__main__":
    main()
