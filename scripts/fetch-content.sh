#!/bin/bash
# Fetch all content (diary + weekly) from private repo bravohenry/fri-content
# Runs at build time on Vercel (needs CONTENT_GITHUB_TOKEN env var)
# Locally, files are already in content/ (gitignored)

set -e

DIARY="content/diary"
WEEKLY="content/weekly"
DAILY="content/daily"

# skip if content already present (local dev)
if [ -d "$DIARY" ] && [ "$(ls -A $DIARY 2>/dev/null)" ] && [ -d "$WEEKLY" ] && [ "$(ls -A $WEEKLY 2>/dev/null)" ]; then
  echo "[fetch-content] content/ already has files, skipping fetch"
  exit 0
fi

TOKEN="${CONTENT_GITHUB_TOKEN:-$DIARY_GITHUB_TOKEN}"

# Trim whitespace/newlines from token
TOKEN=$(echo "$TOKEN" | tr -d '\n' | tr -d ' ')

echo "[fetch-content] Cloning content from private repo..."
git clone --depth 1 "https://x-access-token:${TOKEN}@github.com/quanwenxing/fri-content.git" /tmp/fri-content-clone

mkdir -p "$DIARY" "$WEEKLY" "$DAILY"
cp /tmp/fri-content-clone/diary/*.md "$DIARY/" 2>/dev/null && echo "[fetch-content] Fetched $(ls $DIARY/*.md | wc -l | tr -d ' ') diary entries" || echo "[fetch-content] No diary entries found"
cp /tmp/fri-content-clone/weekly/*.md "$WEEKLY/" 2>/dev/null && echo "[fetch-content] Fetched $(ls $WEEKLY/*.md | wc -l | tr -d ' ') weekly entries" || echo "[fetch-content] No weekly entries found"
cp /tmp/fri-content-clone/daily/*.md "$DAILY/" 2>/dev/null && echo "[fetch-content] Fetched $(ls $DAILY/*.md | wc -l | tr -d ' ') daily digests" || echo "[fetch-content] No daily digests found"
rm -rf /tmp/fri-content-clone
