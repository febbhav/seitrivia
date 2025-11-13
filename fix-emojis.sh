#!/bin/bash
# Emoji & Symbol Fix Script for SEI Team Trivia
# Cleans and replaces garbled UTF-8 sequences with proper emojis/symbols
# Usage: ./fix-emojis.sh

echo "🔧 Starting emoji/symbol fix for SEI Team Trivia files..."

# Cross-platform sed helper
sedi() {
  if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i "" "$@"
  else
    sed -i "$@"
  fi
}

# Process all target files
for f in index.html admin.html app.js admin.js; do
  [[ -f "$f" ]] || continue
  echo "🔨 Fixing $f..."

  # ===================== EMOJI REPLACEMENTS =====================
  sedi "s/ðŸ\"/🔐/g" "$f"
  sedi "s/ðŸ\"§/📧/g" "$f"
  sedi "s/ðŸ\"/🔒/g" "$f"
  sedi "s/ðŸ‘¤/👤/g" "$f"
  sedi "s/ðŸ‘¥/👥/g" "$f"
  sedi "s/ðŸš€/🚀/g" "$f"
  sedi "s/âœ¨/✨/g" "$f"
  sedi "s/ðŸ\"/🔑/g" "$f"
  sedi "s/ðŸ’¡/💡/g" "$f"
  sedi "s/ðŸŒŸ/🌟/g" "$f"
  sedi "s/ðŸŽ¯/🎯/g" "$f"
  sedi "s/ðŸ\"¸/📸/g" "$f"
  sedi "s/ðŸ†/🏆/g" "$f"
  sedi "s/ðŸ¤–/🤖/g" "$f"
  sedi "s/ðŸ\"¥/🔥/g" "$f"
  sedi "s/ðŸŽ‰/🎉/g" "$f"
  sedi "s/ðŸ¥‡/🥇/g" "$f"
  sedi "s/ðŸ¥ˆ/🥈/g" "$f"
  sedi "s/ðŸ¥‰/🥉/g" "$f"
  sedi "s/ðŸšª/🚪/g" "$f"
  sedi "s/ðŸ‘/👏/g" "$f"
  sedi "s/ðŸŽ®/🎮/g" "$f"

  # ===================== ARROW REPLACEMENTS =====================
  sedi "s/â†’/→/g" "$f"
  sedi "s/â†/←/g" "$f"
  sedi "s/Ã¢â‚¬â†’/→/g" "$f"
  sedi "s/Ã¢â€ â€™/→/g" "$f"

  # ===================== CHECKMARK & VALIDATION =====================
  sedi "s/âœ\"/✔/g" "$f"
  sedi "s/âœ\"ï¸/✅/g" "$f"
  sedi "s/Ã¢Å\"â€¦/✅/g" "$f"
  sedi "s/Ã¢Å¡Â Ã¯Â¸Â/⚠️/g" "$f"
  sedi "s/Ã¢Å¡Â Ã¯Â¸Â /⚠️/g" "$f"
  sedi "s/âœ—/✗/g" "$f"
  sedi "s/âœ–/✗/g" "$f"

  # ===================== PUNCTUATION & DASHES =====================
  sedi "s/Ã¢â€\"/—/g" "$f"
  sedi "s/â€\"/—/g" "$f"
  sedi "s/â€“/–/g" "$f"
  sedi "s/â€˜/'/g" "$f"
  sedi "s/â€™/'/g" "$f"
  sedi "s/â€œ/\"/g" "$f"
  sedi "s/â€/\"/g" "$f"
  sedi "s/â€¢/•/g" "$f"
  sedi "s/â€¦/…/g" "$f"
  sedi "s/â€°/‰/g" "$f"

  # ===================== MULTIPLICATION/TIMES =====================
  sedi "s/Ã—/×/g" "$f"
  sedi "s/Ãƒâ€\"/×/g" "$f"

  # ===================== STAR VARIANTS =====================
  sedi "s/â­/⭐/g" "$f"
  sedi "s/Ã°Å¸Â¤â€\"/🤖/g" "$f"
  sedi "s/Ã°Å¸Å½Â¯/🎯/g" "$f"
  sedi "s/Ã°Å¸â€œÂ¸/📸/g" "$f"

  # ===================== MULTI-LAYER CORRUPTIONS =====================
  sedi "s/Ã¢Å\"ÂÃ¯Â¸Â/✅/g" "$f"
  sedi "s/Ã¢Å\"â€¦/…/g" "$f"
  sedi "s/âœ✅/✅/g" "$f"

  # ===================== BUTTON TEXT ISSUES =====================
  sedi "s/Ã¢â€Â â€™/✓/g" "$f"
  sedi "s/ÃƒÂ¢â€Â â€™/✓/g" "$f"

  # ===================== STRAY FRAGMENTS =====================
  sedi "s/ðŸ//g" "$f"
  sedi "s/Ã°Å¸//g" "$f"
  sedi "s/Ã­ï¸//g" "$f"
  sedi "s/ï¸//g" "$f"

  echo "✅ $f fixed"
done

echo ""
echo "✅ Emoji/symbol fix complete!"
echo "🔧 All files have been processed"