#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# OSGL Developers — image pipeline
#
# Downloads the curated 4K stock photographs from Unsplash, then produces a
# consistent, colour-graded set of responsive WebP files for the landing page.
#
# Requirements: bash, curl, ffmpeg (with libwebp)
# Usage:        ./scripts/build-images.sh
#
# Source photographs: Unsplash (free to use under the Unsplash License).
# They are representative imagery, not photographs of the project.
# ---------------------------------------------------------------------------
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CACHE="$ROOT/.cache/images"
OUT="$ROOT/assets/img"
mkdir -p "$CACHE" "$OUT"

GRADE="eq=contrast=1.04:saturation=0.94:brightness=0.006:gamma=1.01,\
colorbalance=rs=0.012:gs=0.004:bs=-0.012:rm=0.008:bm=-0.008,\
unsharp=5:5:0.25:5:5:0"

declare -A SOURCES=(
  [villa-pink]="1580587771525-78b9dba3b914"
  [living-arch]="1600210491892-03d54c0aaf87"
  [villa-white]="1600596542815-ffad4c1539a9"
  [kitchen]="1600585152220-90363fe7e115"
  [bedroom-dark]="1616594039964-ae9021a400a0"
  [resort]="1551882547-ff40c63fe5fa"
  [gym]="1540497077202-7c8a3999166f"
  [yoga]="1575052814086-f385e2e2ad1b"
  [lounge]="1524758631624-e2822e304c36"
  [garden]="1585320806297-9794b3e4eeae"
  [villa-reflect]="1613490493576-7fde63acd811"
  [villa-palm]="1512917774080-9991f1c4c750"
  [living-soft]="1618221195710-dd6b41faaea6"
  [living-warm]="1600210492486-724fe5c67fb0"
  [bedroom-sage]="1615874959474-d609969a20ed"
  [airport-sunset]="1436491865332-7a61a109cc05"
)

fetch_source() {
  local name="$1" id="${SOURCES[$1]}" file="$CACHE/$1.jpg"
  if [[ ! -s "$file" ]]; then
    echo "  ↓ downloading $name"
    curl -fsSL --retry 3 -o "$file" \
      "https://images.unsplash.com/photo-${id}?w=3840&q=90&fm=jpg&fit=max"
  fi
}

# make <name> <source> <crop WxH+X+Y> <widths> <quality>
make() {
  local name="$1" src="$2" crop="$3" widths="$4" quality="${5:-78}"
  fetch_source "$src"
  echo "  → $name ($crop)"
  for w in $widths; do
    ffmpeg -hide_banner -loglevel error -y -i "$CACHE/$src.jpg" \
      -vf "crop=${crop},scale=${w}:-2:flags=lanczos,${GRADE}" \
      -c:v libwebp -quality "$quality" -compression_level 6 -preset photo \
      -pix_fmt yuv420p "$OUT/${name}-${w}.webp"
  done
}

echo "Building OSGL image set…"

# Hero — Spanish-Mediterranean villa with pool (wide + portrait crop)
make hero villa-pink 3840:2160:0:480 "960 1600 2400 3200 3840" 78
make hero-mobile villa-pink 2160:2880:1200:0 "640 900 1200 1600" 78

# A JPEG fallback for very old browsers and social previews
ffmpeg -hide_banner -loglevel error -y -i "$CACHE/villa-pink.jpg" \
  -vf "crop=3840:2160:0:480,scale=1600:-2:flags=lanczos,${GRADE}" \
  -q:v 4 "$OUT/hero-1600.jpg"

# Project overview
make about-living living-arch 3000:4000:0:0 "480 640 800 1200 1600" 78
make about-villa villa-white 3600:2400:120:74 "480 800 1200 1800" 78

# Residences
make residence-kitchen kitchen 2048:2560:896:0 "480 640 800 1200 1600" 78
make residence-bedroom bedroom-dark 3072:3072:384:0 "480 800 1200 1600" 74

# Amenities
make amenity-pool resort 3200:2133:500:220 "480 800 1200 1800" 76
make amenity-gym gym 3456:2304:192:128 "480 800 1200 1800" 77
make amenity-yoga yoga 3456:2304:192:128 "480 800 1200 1800" 77
make amenity-club lounge 3400:2267:181:120 "480 800 1200 1800" 77

# Gallery
make gallery-villa-reflect villa-reflect 3456:2304:192:128 "480 800 1200 1800" 77
make gallery-villa-palm villa-palm 3456:2304:192:128 "480 800 1200 1800" 77
make gallery-living-soft living-soft 3600:2025:120:0 "480 800 1200 1800" 77
make gallery-living-warm living-warm 3456:2592:192:144 "480 800 1200 1800" 75
make gallery-bedroom-sage bedroom-sage 3072:3840:384:0 "480 800 1200" 74
make gallery-kitchen kitchen 3413:2560:213:0 "480 800 1200 1800" 77
make gallery-villa-white villa-white 3456:2304:192:122 "480 800 1200 1800" 75
make gallery-garden garden 3240:2160:300:0 "480 800 1200" 74

# Location / airport context
make airport airport-sunset 3400:2267:220:141 "480 800 1200" 77

echo
echo "Done. $(find "$OUT" -name '*.webp' | wc -l) WebP files, $(du -sh "$OUT" | cut -f1) total."
