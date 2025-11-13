#!/bin/bash
# fix-emojis.sh — comprehensive UTF-8 corruption repair script

echo "🔧 Starting emoji/symbol fix for SEI Team Trivia files..."

# sed wrapper for macOS
sedi() {
  if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i "" "$@"
  else
    sed -i "$@"
  fi
}

FILES="index.html admin.html app.js admin.js"

for f in $FILES; do
  [[ -f "$f" ]] || continue
  echo "🔨 Fixing $f..."

  #
  # =========================================================
  # 1. REMOVE ALL CORRUPT UTF-8 PREFIXES
  # =========================================================
  #

  # All of these appear across your HTML/JS files:
  sedi 's/ÃƒÂ°//g' "$f"
  sedi 's/Ãƒ//g' "$f"
  sedi 's/Ã¢//g' "$f"
  sedi 's/Ã¯//g' "$f"
  sedi 's/Ã­//g' "$f"
  sedi 's/Â//g' "$f"
  sedi 's/Ã//g' "$f"

  # Your two biggest corruption families:
  sedi 's/°Ã//g' "$f"
  sedi 's/¢Ã//g' "$f"

  #
  # =========================================================
  # 2. FIX CHECKMARKS, Xs, STATUS ICONS
  # =========================================================
  #

  # Complete / check
  sedi 's/“â‚¬¦/✔/g' "$f"
  sedi 's/“â‚¬“/✔/g' "$f"
  sedi 's/“â‚¬/✔/g' "$f"

  # Incomplete / X
  sedi 's/¡ª/✗/g' "$f"
  sedi 's/¡¯/✗/g' "$f"
  sedi 's/—/✗/g' "$f"

  # Warning
  sedi 's/¯¸/⚠️/g' "$f"
  sedi 's/Ã‚¸/⚠️/g' "$f"

  #
  # =========================================================
  # 3. FIX BADGE LABELS & TEXT TAGS
  # =========================================================
  #

  # Skills question badge
  sedi 's/¸â‚¬Å“Ã‚/🛠 Skills Question/g' "$f"
  sedi 's/Ã‚ Skills Question/🛠 Skills Question/g' "$f"

  # Regular question badge
  sedi 's/â‚¬Å“/Regular Question/g' "$f"

  # Has images
  sedi 's/â‚¬“Ã‚¼/g' "$f"
  sedi 's/Has Images/🖼 Has Images/g' "$f"

  #
  # =========================================================
  # 4. FIX USER ICONS, PROFILE FALLBACKS
  # =========================================================
  #

  # The fallback avatar corruption
  sedi 's/¸‘Ã‚¤/👤/g' "$f"

  #
  # =========================================================
  # 5. FIX ALL QUOTES, DASHES, BULLETS
  # =========================================================
  #

  # Smart quotes
  sedi 's/â€™/'"'"'/g' "$f"      # apostrophe
  sedi 's/â€œ/"/g' "$f"
  sedi 's/â€/"/g' "$f"

  # Dashes
  sedi 's/â€“/–/g' "$f"
  sedi 's/â€”/—/g' "$f"

  # Bullet
  sedi 's/â€¢/•/g' "$f"

  # Ellipsis
  sedi 's/â€¦/…/g' "$f"

  #
  # =========================================================
  # 6. FIX ARROWS
  # =========================================================
  #

  sedi "s/â†’/→/g" "$f"
  sedi "s/â†/←/g" "$f"
  sedi "s/Â»/→/g" "$f"
  sedi "s/Â«/←/g" "$f"

  #
  # =========================================================
  # 7. FIX REMAINING BROKEN BYTE SEQUENCES
  # =========================================================
  #

  # All starting with Å (broken unicode)
  sedi 's/Å[[:alnum:]]//g' "$f"

  # Remove leftover variation selectors
  sedi 's/ï¸//g' "$f"

  #
  # =========================================================
  # 8. OPTIONAL: REMOVE ANY REMAINING NON-ASCII CORRUPTED NOISE
  # =========================================================
  #

  # Strip any lingering invalid bytes (safe)
  sedi 's/[^[:print:]\t]//g' "$f"

  echo "✅ $f cleaned"
done

echo "🎉 Emoji/encoding cleanup complete!"


#!/usr/bin/env bash
set -euo pipefail

FILES=("admin.html" "admin.js" "app.js" "index.html")

for f in "${FILES[@]}"; do
  if [[ ! -f "$f" ]]; then
    echo "Skipping $f (not found)"
    continue
  fi

  echo "Fixing encoding issues in $f"

  #
  # 1) Button arrow: ” ’  →  ›
  #
  sed -i '' $'s/” ’/›/g' "$f"

  #
  # 2) “Add custom skill” prefix: Å¾”¢  →  ➕
  #
  sed -i '' $'s/Å¾”¢/➕/g' "$f"

  #
  # 3) “Congratulations” prefix: Å½”°  →  🎉
  #
  sed -i '' $'s/Å½”°/🎉/g' "$f"

  #
  # 4) Wrong-answer mark: Å“✗  →  ✗
  #
  sed -i '' $'s/Å“✗/✗/g' "$f"

  #
  # 5) Avatar placeholder: ‘¤  →  🙂 
  #
  sed -i '' $'s/‘¤/🙂/g' "$f"

  #
  # 6) Profile modal labels:
  #    “ Location        →  📍 Location
  #    ’¼ Current Client →  🏢 Current Client
  #
  sed -i '' $'s/“ Location/📍 Location/g' "$f"
  sed -i '' $'s/’¼ Current Client/🏢 Current Client/g' "$f"

  #
  # 7) Minor spacing: ⚠️This → ⚠️ This
  #
  sed -i '' $'s/⚠️This/⚠️ This/g' "$f"

done

echo "Encoding fixes complete."


#!/bin/bash

# Fix encoding issues in HTML/JS files by replacing mojibake with correct emoji ⚠️

FILES="*.html *.js"

echo "=== Fixing encoding issues (mojibake → ⚠️)… ==="

for f in $FILES; do
    echo "Processing $f"

    # Remove stray UTF-8 corruption bytes (Â Ã ï ¿ ½)
    sed -i '' \
        -e 's/Â//g' \
        -e 's/Ã//g' \
        -e 's/ï//g' \
        -e 's/¿//g' \
        -e 's/½//g' \
        "$f"

    # Replace corrupted leading icon clusters with ⚠️
    sed -i '' \
        -e "s/¢[[:space:]]*¡[[:space:]]*‚/⚠️/g" \
        -e "s/¢¡‚/⚠️/g" \
        -e "s/¯‚¸‚/⚠️/g" \
        -e "s/¸‚/⚠️/g" \
        -e "s/¢/⚠️/g" \
        -e "s/¡/⚠️/g" \
        -e "s/‚/⚠️/g" \
        -e "s/¯/⚠️/g" \
        -e "s/¸/⚠️/g" \
        "$f"

    # Fix partial icon sequences
    sed -i '' \
        -e "s/�/⚠️/g" \
        -e "s/–/⚠️/g" \
        "$f"

    # Normalize any "⚠️ Incomplete" spacing
    sed -i '' \
        -e "s/⚠️[[:space:]]*Incomplete/⚠️ Incomplete/g" \
        "$f"

done

echo "=== Completed. All mojibake replaced with ⚠️ ==="