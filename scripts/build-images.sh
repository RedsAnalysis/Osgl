#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# OSGL Developers — image pipeline (portfolio edition)
#
# Sources:
#   • Three high-rise residential photographs from Pexels (free licence).
#   • Pool and interior photographs from Unsplash (free licence).
#
# Output: colour-graded, responsive WebP files for the four-page site.
# Requirements: bash, curl, ffmpeg (with libwebp).
# Usage: ./scripts/build-images.sh
# ---------------------------------------------------------------------------
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CACHE="$ROOT/.cache/images"
OUT="$ROOT/assets/img"
mkdir -p "$CACHE" "$OUT"

GRADE="eq=contrast=1.04:saturation=0.93:brightness=0.006:gamma=1.01,\
colorbalance=rs=0.012:gs=0.004:bs=-0.012:rm=0.008:bm=-0.008,\
unsharp=5:5:0.25:5:5:0"

fetch_pexels() {
  local name="$1" id="$2" file="$CACHE/$1.jpg"
  if [[ ! -s "$file" ]]; then
    echo "  ↓ downloading $name (Pexels $id)"
    curl -fsSL --retry 3 -o "$file" \
      "https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg"
  fi
}

fetch_unsplash() {
  local name="$1" id="$2" file="$CACHE/$1.jpg"
  if [[ ! -s "$file" ]]; then
    echo "  ↓ downloading $name (Unsplash)"
    curl -fsSL --retry 3 -o "$file" \
      "https://images.unsplash.com/photo-${id}?w=3840&q=90&fm=jpg&fit=max"
  fi
}

# make <name> <source> <crop WxH+X+Y> <widths> <quality>
make() {
  local name="$1" src="$2" crop="$3" widths="$4" quality="${5:-78}"
  echo "  → $name ($crop)"
  for w in $widths; do
    ffmpeg -hide_banner -loglevel error -y -i "$CACHE/$src.jpg" \
      -vf "crop=${crop},scale=${w}:-2:flags=lanczos,${GRADE}" \
      -c:v libwebp -quality "$quality" -compression_level 6 -preset photo \
      -pix_fmt yuv420p "$OUT/${name}-${w}.webp"
  done
}

echo "Building OSGL portfolio image set…"

# High-rise heroes / cards (4:5 portrait)
fetch_pexels tower-a 32241750
fetch_pexels tower-b 31848592
fetch_pexels tower-c 33975719
make tower-a tower-a 3200:4000:2800:0 "640 960 1280 1600 2000 2560" 70
make tower-b tower-b 2560:3200:1400:0 "640 960 1280 1600 2000" 70
make tower-c tower-c 3412:4265:0:400 "640 960 1280 1600 2000" 70

# Wide architecture detail used in the gallery strip
make detail-a tower-a 6000:3375:0:312 "960 1600 2400" 77

# Amenity + interior gallery images (4:5)
fetch_unsplash pool 1551882547-ff40c63fe5fa
fetch_unsplash interior 1600210491892-03d54c0aaf87
make pool pool 2048:2560:896:0 "480 800 1200 1600" 76
make interior interior 3000:3750:0:125 "480 800 1200 1600" 76

echo
echo "Done. $(find "$OUT" -name '*.webp' | wc -l) WebP files, $(du -sh "$OUT" | cut -f1)."
