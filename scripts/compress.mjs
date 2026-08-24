/**
 * Converts the originals in raw/ into the site's public/photos/*.webp.
 *
 * Two crop modes:
 *  - `extract`  — a hand-tuned rectangle (story photos, where the right
 *                 framing is a judgement call: screenshot furniture to
 *                 remove, faces near an edge to protect).
 *  - otherwise  — sharp's `attention` strategy picks the crop window,
 *                 which handles a pile of 9:16 phone shots well enough
 *                 that hand-tuning each one isn't worth it. Add an
 *                 `extract` to any entry it gets wrong.
 *
 * Nothing is ever upscaled: the crop is taken at native resolution and
 * only downscaled if it exceeds MAX_EDGE.
 *
 * Run: node scripts/compress.mjs
 * Previews for eyeballing land in scripts/.preview/ (gitignored).
 */
import sharp from "sharp";
import { mkdirSync, statSync } from "fs";

const MAX_EDGE = 1600;
const TARGET_KB = 200;
const PREVIEW_DIR = "scripts/.preview";

/** aspect: "portrait" = 3:4, "landscape" = 4:3 */
const PHOTOS = [
  // ── Story of Her (S3) ────────────────────────────────────────────────
  {
    out: "ch1",
    src: "raw/story/HS 1.jpeg",
    aspect: "portrait",
    // 0.44 is far taller than any frame — anchor to the top so both faces survive.
    extract: { left: 0, top: 0, width: 688, height: 917 },
  },
  {
    out: "ch2",
    src: "raw/story/HS 2.jpeg",
    aspect: "portrait",
    // Instagram story: banner ends y=176, photo runs to y=955 (measured).
    extract: { left: 30, top: 182, width: 580, height: 773 },
  },
  {
    out: "ch3",
    src: "raw/story/HS 3.jpeg",
    aspect: "portrait",
    extract: { left: 10, top: 0, width: 960, height: 1280 },
  },
  {
    out: "ch4",
    src: "raw/story/HS 4.jpeg",
    aspect: "landscape",
    // Restored version is already exactly 4:3.
    extract: { left: 0, top: 0, width: 1195, height: 896 },
  },
  {
    out: "ch5",
    src: "raw/story/HS 5.1.jpeg",
    aspect: "landscape",
    // 16:9 selfie, face centred — take the middle 4:3. Lowest-res source; never upscale.
    extract: { left: 80, top: 0, width: 480, height: 360 },
  },
  {
    out: "ch6",
    src: "raw/story/HS 6.jpeg",
    aspect: "portrait",
    extract: { left: 0, top: 0, width: 960, height: 1280 },
  },
  {
    out: "ch7",
    src: "raw/story/HS 7.jpeg",
    aspect: "landscape",
    // She sits left of centre; anchor the 4:3 window to the left edge.
    extract: { left: 0, top: 0, width: 2261, height: 1696 },
  },

  // ── Polaroid wall (S4) ───────────────────────────────────────────────
  { out: "p01", src: "raw/polaroids/1.jpg", aspect: "landscape" },
  {
    out: "p02",
    src: "raw/polaroids/2.JPG",
    // The real photo is a landscape frame sitting inside a portrait canvas
    // with grey bars; content measured at y 501..1100.
    aspect: "landscape",
    extract: { left: 50, top: 501, width: 800, height: 600 },
  },
  { out: "p03", src: "raw/polaroids/3.jpg", aspect: "portrait" },
  { out: "p04", src: "raw/polaroids/4.JPG", aspect: "portrait" },
  { out: "p05", src: "raw/polaroids/5.JPG", aspect: "portrait" },
  { out: "p06", src: "raw/polaroids/6.JPG", aspect: "portrait" },
  {
    out: "p07",
    src: "raw/polaroids/7.JPG",
    aspect: "portrait",
    // Attention chased the saree embroidery and cropped her head off.
    extract: { left: 0, top: 0, width: 720, height: 960 },
  },
  { out: "p08", src: "raw/polaroids/8.JPG", aspect: "portrait" },
  {
    out: "p09",
    src: "raw/polaroids/9.PNG",
    aspect: "portrait",
    // Dark cinema selfie, letterboxed. Attention cropped his face off —
    // frame both of them by hand and lift the shadows.
    extract: { left: 0, top: 370, width: 1320, height: 1760 },
    brighten: 1.45,
  },
  { out: "p10", src: "raw/polaroids/10.JPG", aspect: "portrait" },
  {
    out: "p11",
    src: "raw/polaroids/11.jpg",
    aspect: "portrait",
    // Anchor to the top so her forehead isn't sliced off.
    extract: { left: 0, top: 0, width: 1320, height: 1760 },
  },
  { out: "p12", src: "raw/polaroids/12.jpg", aspect: "portrait" },
  { out: "p13", src: "raw/polaroids/13.jpg", aspect: "portrait" },
  { out: "p14", src: "raw/polaroids/14.JPG", aspect: "portrait" },

  // ── Teddy easter egg ─────────────────────────────────────────────────
  {
    out: "secret",
    src: "raw/secret/WhatsApp Image 2026-08-24 at 10.48.23 PM.jpeg",
    aspect: "portrait",
  },
];

/** Largest box of `ratio` that fits inside width×height, capped at MAX_EDGE. */
function fitBox(width, height, ratio) {
  let w;
  let h;
  if (width / height > ratio) {
    h = height;
    w = Math.round(height * ratio);
  } else {
    w = width;
    h = Math.round(width / ratio);
  }
  const longEdge = Math.max(w, h);
  if (longEdge > MAX_EDGE) {
    const scale = MAX_EDGE / longEdge;
    w = Math.round(w * scale);
    h = Math.round(h * scale);
  }
  return { w, h };
}

mkdirSync("public/photos", { recursive: true });
mkdirSync(PREVIEW_DIR, { recursive: true });

for (const photo of PHOTOS) {
  const ratio = photo.aspect === "portrait" ? 3 / 4 : 4 / 3;
  let pipeline = sharp(photo.src).rotate();

  if (photo.extract) {
    const { width, height } = photo.extract;
    const actual = width / height;
    if (Math.abs(actual - ratio) > 0.005) {
      throw new Error(
        `${photo.out}: crop is ${actual.toFixed(3)}, expected ${ratio.toFixed(3)}`,
      );
    }
    pipeline = pipeline.extract(photo.extract);
    const box = fitBox(width, height, ratio);
    if (box.w < width) pipeline = pipeline.resize(box.w, box.h);
  } else {
    const meta = await sharp(photo.src).rotate().metadata();
    const box = fitBox(meta.width, meta.height, ratio);
    pipeline = pipeline.resize(box.w, box.h, {
      fit: "cover",
      position: sharp.strategy.attention,
    });
  }

  if (photo.brighten) {
    pipeline = pipeline.modulate({ brightness: photo.brighten });
  }

  // Step the quality down until it fits the budget.
  let quality = 80;
  let info;
  const dest = `public/photos/${photo.out}.webp`;
  for (;;) {
    info = await pipeline.clone().webp({ quality }).toFile(dest);
    if (statSync(dest).size / 1024 <= TARGET_KB || quality <= 50) break;
    quality -= 6;
  }

  await pipeline
    .clone()
    .jpeg({ quality: 82 })
    .toFile(`${PREVIEW_DIR}/${photo.out}.jpg`);

  const kb = Math.round(statSync(dest).size / 1024);
  console.log(
    `${photo.out}.webp  ${String(info.width).padStart(4)}x${String(info.height).padEnd(4)}  ${photo.aspect.padEnd(9)} q${quality}  ${kb}KB`,
  );
}
