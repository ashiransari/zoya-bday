/**
 * Converts the originals in raw/ into the site's public/photos/*.webp.
 *
 * Crop rectangles are hand-tuned per photo (faces intact, screenshot
 * furniture removed) and chosen so no image is ever upscaled — every
 * output is a straight crop of the source at its native resolution,
 * then only downscaled if it exceeds MAX_EDGE.
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
];

mkdirSync("public/photos", { recursive: true });
mkdirSync(PREVIEW_DIR, { recursive: true });

for (const photo of PHOTOS) {
  const wanted = photo.aspect === "portrait" ? 3 / 4 : 4 / 3;
  const { width, height } = photo.extract;
  const actual = width / height;
  if (Math.abs(actual - wanted) > 0.005) {
    throw new Error(
      `${photo.out}: crop is ${actual.toFixed(3)}, expected ${wanted.toFixed(3)}`,
    );
  }

  const base = sharp(photo.src).rotate().extract(photo.extract);
  const longEdge = Math.max(width, height);
  const pipeline =
    longEdge > MAX_EDGE
      ? base.resize(
          width >= height ? { width: MAX_EDGE } : { height: MAX_EDGE },
        )
      : base;

  // Step the quality down until it fits the budget.
  let quality = 80;
  let info;
  const dest = `public/photos/${photo.out}.webp`;
  for (;;) {
    info = await pipeline.clone().webp({ quality }).toFile(dest);
    if (statSync(dest).size / 1024 <= TARGET_KB || quality <= 50) break;
    quality -= 6;
  }

  await pipeline.clone().jpeg({ quality: 82 }).toFile(`${PREVIEW_DIR}/${photo.out}.jpg`);

  const kb = Math.round(statSync(dest).size / 1024);
  console.log(
    `${photo.out}.webp  ${info.width}x${info.height}  ${photo.aspect.padEnd(9)} q${quality}  ${kb}KB`,
  );
}
