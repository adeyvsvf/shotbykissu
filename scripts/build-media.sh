#!/usr/bin/env bash
# Builds web-ready media from the originals in assets/nunu into assets/web.
# Originals are large HEVC .mov files and stay out of git (see .gitignore).
# Usage: scripts/build-media.sh   (needs ffmpeg and cwebp)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/assets/nunu"
OUT="$ROOT/assets/web"
mkdir -p "$OUT/reels" "$OUT/posters" "$OUT/img"

# slug | source file | poster time (s)
REELS=(
  "c-and-r|Weddings/C & R.mov|28"
  "s-and-d|Weddings/S & D.mov|24"
  "k-and-d|Weddings/K & D.mov|11"
  "m-and-b|Weddings/M & B.mov|34"
  "e-and-e|Weddings/E & E.mov|27"
  "a-and-t|Weddings/copy_A8744776-F77A-4B03-8F18-21E1443B2C03.mov|23"
  "sips-and-stir|Brand shoots/inmark.MP4|9"
  "nk|Brand shoots/copy_0323D92D-E4BF-42EE-B246-85F1C25477D2.mov|6"
  "ore|Events/Ore Human Dicovery edit.mov|23"
  "lr|Events/copy_D63DDB35-26B6-4483-9313-82AACB00AE85.mov|17"
)

ff() { ffmpeg -loglevel error -y "$@"; }

for row in "${REELS[@]}"; do
  IFS='|' read -r slug file t <<< "$row"
  echo "reel: $slug"
  # Player version: 720x1280, 30fps, H.264 capped near 1.5 Mbps, with sound, streamable.
  [ -f "$OUT/reels/$slug.mp4" ] || ff -i "$SRC/$file" \
    -vf "fps=30,scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280" \
    -c:v libx264 -preset slow -crf 30 -maxrate 1500k -bufsize 3000k -pix_fmt yuv420p -profile:v high \
    -c:a aac -b:a 96k -movflags +faststart "$OUT/reels/$slug.mp4"
  # Poster still.
  ff -ss "$t" -i "$SRC/$file" -frames:v 1 \
    -vf "scale=540:960:force_original_aspect_ratio=increase,crop=540:960" "$OUT/posters/$slug.png"
  cwebp -quiet -q 72 "$OUT/posters/$slug.png" -o "$OUT/posters/$slug.webp"
  rm "$OUT/posters/$slug.png"
done

echo "hero"
ff -i "$SRC/wedding.mp4" -an -vf "scale=1280:-2" \
  -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p -movflags +faststart "$OUT/hero.mp4"
ff -ss 0.2 -i "$SRC/wedding.mp4" -frames:v 1 -vf "scale=1280:-2" "$OUT/hero-poster.png"
cwebp -quiet -q 70 "$OUT/hero-poster.png" -o "$OUT/hero-poster.webp"
rm "$OUT/hero-poster.png"

echo "portrait"
sips -s format png "$SRC/Kissu.JPG" --out "$OUT/img/kissu-full.png" >/dev/null
cwebp -quiet -q 78 -resize 640 0 "$OUT/img/kissu-full.png" -o "$OUT/img/kissu-640.webp"
cwebp -quiet -q 78 -resize 1100 0 "$OUT/img/kissu-full.png" -o "$OUT/img/kissu-1100.webp"
rm "$OUT/img/kissu-full.png"

echo "done"
du -sh "$OUT"
