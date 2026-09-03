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
 *  2. Settings are DERIVED from a measured sweep, not picked by feel. The CMC
 *     hero was compared against a lossless render of its crop + loop timeline:
 *
 *       vp9  crf 28  1489 KB  SSIM .9900    h264 crf 20  2362 KB  SSIM .9909
 *            crf 30  1308 KB       .9895         crf 22  1832 KB       .9899
 *            crf 32  1122 KB       .9886         crf 24  1436 KB       .9887
 *
 *     VP9 30 and H.264 22 sit at the measured size/quality knee, both near .990
 *     SSIM. The visualiser is a far more detailed render and needs its own
 *     numbers: at the hero's crf its MP4 came out LARGER than the source file.
 *
 *     The visualiser was re-swept for the marble-20 master, against a LOSSLESS
 *     ffv1 render of the folded 270-frame timeline rather than against the raw
 *     file — the fold is part of the picture, so the untrimmed master is the
 *     wrong reference. PSNR frame-aligned (see the warning below):
 *
 *       vp9  crf 22  2298 KB  49.29 dB      h264 crf 20  3152 KB  50.78 dB
 *            crf 24  2133 KB  48.91 dB           crf 21  2883 KB  50.31 dB
 *            crf 26  1874 KB  48.26 dB           crf 22  2626 KB  49.23 dB
 *            crf 28  1685 KB  47.71 dB           crf 23  2364 KB  48.34 dB
 *            crf 30  1513 KB  47.17 dB           crf 25  1867 KB  46.77 dB
 *            crf 32  1324 KB  46.48 dB           crf 27  1480 KB  45.33 dB
 *
 *     Still no knee, so still a budget call. Two numbers set it.
 *
 *     THE MASTER IS THE CEILING. marble-20 arrives already compressed at 1.56
 *     Mbps — 1901 KB for 300 frames, so 1711 KB for the 270 we keep. Spending
 *     more than that re-encodes its artefacts at higher fidelity and buys
 *     nothing. vp9 28 is the last rung under it.
 *
 *     THE RUG IS THE FLOOR. Same test crop as before (520x260 at 560,660, the
 *     jute weave — the finest detail in frame): vp9 28 holds it at 47.01 dB,
 *     and an 8x-amplified difference against the master is structureless. The
 *     old ship called 44.2 dB on this crop a match by eye, so there is 2.8 dB
 *     of headroom. The softer master is why: at 1.56 Mbps in there is less
 *     fine detail left to lose than the 3.1 Mbps predecessor had.
 *
 *     So vp9 28, and h264 23 to MATCH IT rather than to match its size —
 *     46.99 dB against 47.01 on that crop, so Safari and Chrome get the same
 *     picture. h264 cannot reach that under the master's byte count (VP9 is
 *     ~1.3 dB ahead at equal size on this clip); the match is worth more than
 *     the parity, because the MP4 is what pre-17.4 iOS Safari actually plays.
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
 * WATERMARK (hero). A Gemini sparkle sits at x1135..1184 y574..629 in all 240
 * frames. Interpolating that 50x56 patch leaves obvious horizontal/vertical
 * smears when it crosses marble veins, floor reflections and furniture. The
 * final therefore removes the marked pixels completely: crop the clean
 * 1120x630 region at x0/y45, then Lanczos-scale it back to 1280x720. Contact
 * sheets at every half-second confirm the mark is gone and the left/centre
 * architectural subjects remain framed cleanly.
 *
 * THE VISUALISER's dead tail comes off; its frozen head does NOT. Measured on
 * the marble-20 master (300 frames at 30fps, mean abs frame delta on a 192x108
 * grey downscale), the structure is:
 *
 *     0..22    frozen     the bare room, before the cursor arrives
 *     23..62   motion     swap 1 — floor
 *     63..74   hold       0.4s dwell on the result
 *     75..114  motion     swap 2 — wall
 *     115..125 hold
 *     126..165 motion     swap 3 — staircase
 *     166..178 hold
 *     179..217 motion     swap 4 — soffit
 *     218..299 frozen     2.73s of nothing
 *
 * The four holds are authored beats and stay. The 82-frame tail is dead air
 * and mostly goes. The 23-frame head is NOT dead air here — it is exactly the
 * runway the fold needs, which is what sets `fade`.
 *
 * LOOP SEAM (both). Neither clip loops as delivered. Both are fixed by folding
 * the tail back over the head —
 *     O(t) = orig(t)*(t/X) + orig(t+L)*(1 - t/X)   for t < X
 *     O(t) = orig(t)                               for t >= X
 * with L = N - X, which makes the loop point continuous by construction.
 *
 * The hero's final dark-marble shot starts at frame 216. Dropping its first four
 * source frames and folding 20 frames makes the 9-second wrap land between
 * source frames 219/220, inside that continuous shot instead of on its opening
 * cut. The visualiser fold is only clean if BOTH inputs are frozen — otherwise
 * the cursor and its swatch card fade in and out mid-dissolve. So X is pinned
 * to its frozen head: X = 23, no more. `keep` then follows from the length:
 * 9.00s is 270 frames out, output is N - X, so N = 293. Frames 270..292 are
 * the fold's tail side and all sit inside the frozen 218..299 run, as required.
 * What is left over — frames 218..269, 1.73s — is the dwell on the finished
 * room, which is the shot the CTA sits on and the one worth holding.
 *
 * The visualiser result measures 1.05 against a 1.60 in-clip maximum: the wrap
 * is now quieter than the busiest ordinary frame transition in the clip.
 *
 * Usage:  node tools/optimize-video.mjs [--audit] [--clip=hero|visualiser]
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
const CLIP_NAME = process.argv.find((arg) => arg.startsWith("--clip="))?.slice("--clip=".length);
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
    src: "hero-cmc-raw.mp4",
    out: "hero",
    poster: "hero-poster.webp",
    display: [1440, 892], // 544:4024 — aspect 1.614 vs the clip's 1.778
    pre: [
      "crop=1120:630:0:45",
      "scale=1280:720:flags=lanczos",
      "format=yuv420p",
      "setparams=range=limited:color_primaries=bt709:color_trc=bt709:colorspace=bt709",
    ],
    keep: [4, 240], // shifts the loop join four frames inside the final shot
    retime: null, // preserve the authored 24fps motion
    fade: 20, // 0.83s dissolve; 236 kept - 20 folded = 216 frames / 9.00s
    crf: { h264: 22, vp9: 30 },
    note: "8-shot CMC marble montage — clean crop, seamless loop",
  },
  {
    src: "visualiser-raw.mp4",
    out: "visualiser",
    poster: "visualiser-poster.webp",
    display: [1440, 815], // 544:4015 — aspect 1.767 vs the clip's 1.778, near-exact
    pre: ["setparams=range=limited:color_primaries=bt709:color_trc=bt709:colorspace=bt709"],
    keep: [0, 293], // keep the frozen head (the fold needs it); drop the dead tail
    retime: null, // the authored pace is right — four swaps and their dwells in 6.5s
    fade: 23, // = the frozen head exactly, so the 0.77s dissolve never catches the cursor
    crf: { h264: 23, vp9: 28 }, // quality-matched at ~47.0dB on the rug; see the sweep above
    note: "surface-swap demo — seamless loop",
  },
];

const selectedClips = CLIP_NAME ? CLIPS.filter(({ out }) => out === CLIP_NAME) : CLIPS;
if (CLIP_NAME && selectedClips.length === 0) {
  console.error(`Unknown clip ${CLIP_NAME}; expected one of ${CLIPS.map(({ out }) => out).join(", ")}`);
  process.exit(1);
}

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
for (const clip of selectedClips) {
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
    "-pix_fmt", "yuv420p",
    "-color_range", "tv", "-colorspace", "bt709",
    "-color_primaries", "bt709", "-color_trc", "bt709",
    "-an", webm,
  ]);

  // MP4 / H.264 — the fallback. faststart puts the moov atom first so the clip
  // starts before it has fully downloaded.
  await run("ffmpeg", [
    "-y", "-v", "error", "-i", src,
    "-filter_complex", fc, "-map", "[v]", "-r", String(rate),
    "-c:v", "libx264", "-preset", "slow", "-crf", String(clip.crf.h264),
    "-profile:v", "high", "-level", "3.1", "-g", gop,
    "-pix_fmt", "yuv420p",
    "-color_range", "tv", "-colorspace", "bt709",
    "-color_primaries", "bt709", "-color_trc", "bt709",
    "-an", "-movflags", "+faststart", mp4,
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
