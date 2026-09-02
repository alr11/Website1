#!/usr/bin/env bash
#
# Builds the distributable zip for Gumroad / CodeCanyon.
#
#   ./packaging/build-package.sh [--with-mobile] [--out DIR]
#
# The mobile app is excluded by default: it typechecks but has not been
# compiled on a device. Add --with-mobile once you have built it in Xcode.
#
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
NAME="everly-wedding-planner"
OUT="$ROOT/dist-package"
WITH_MOBILE=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --with-mobile) WITH_MOBILE=1; shift ;;
    --out) OUT="$2"; shift 2 ;;
    *) echo "Unknown option: $1" >&2; exit 1 ;;
  esac
done

STAGE="$OUT/$NAME"
rm -rf "$OUT"
mkdir -p "$STAGE"

echo "Staging into $STAGE"

# --- the app itself --------------------------------------------------------
cp -R "$ROOT/src" "$STAGE/src"
cp -R "$ROOT/supabase" "$STAGE/supabase"
cp -R "$ROOT/tests" "$STAGE/tests"
cp -R "$ROOT/docs" "$STAGE/docs"

for file in \
  package.json package-lock.json tsconfig.json next.config.mjs \
  postcss.config.mjs tailwind.config.ts components.json \
  playwright.config.ts .eslintrc.json .env.example .gitignore \
  LICENSE.md THIRD-PARTY-NOTICES.md
do
  cp "$ROOT/$file" "$STAGE/$file"
done

# Buyer-facing README replaces the repository one.
cp "$ROOT/packaging/README-package.md" "$STAGE/README.md"

# --- optional mobile app ---------------------------------------------------
if [[ "$WITH_MOBILE" == "1" ]]; then
  echo "Including mobile/"
  mkdir -p "$STAGE/mobile"
  # Copy everything tracked, minus build and dependency output.
  rsync -a \
    --exclude node_modules --exclude .expo --exclude ios --exclude android \
    --exclude dist --exclude '.env' --exclude '.env.*' \
    "$ROOT/mobile/" "$STAGE/mobile/"
else
  echo "Excluding mobile/ (pass --with-mobile to include it)"
fi

# --- scrub anything that should never ship ---------------------------------
find "$STAGE" -name '.DS_Store' -delete
find "$STAGE" -name '*.log' -delete
rm -rf "$STAGE/.next" "$STAGE/node_modules" "$STAGE/test-results" \
       "$STAGE/playwright-report" "$STAGE/.env.local"

# Fail loudly rather than shipping someone's credentials.
if grep -rIl --exclude-dir=node_modules -E 'supabase\.co|sb_(publishable|secret)_|eyJhbGciOi' "$STAGE" \
     | grep -v -E 'README|THIRD-PARTY|\.env\.example|mock-supabase|LICENSE' ; then
  echo "ERROR: possible real credentials or project URLs found above." >&2
  exit 1
fi

# --- zip it ----------------------------------------------------------------
cd "$OUT"
zip -qr "$NAME.zip" "$NAME"
cd - > /dev/null

echo
echo "Package: $OUT/$NAME.zip"
du -h "$OUT/$NAME.zip" | cut -f1
find "$STAGE" -type f | wc -l | xargs echo "Files:"
