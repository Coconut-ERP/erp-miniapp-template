#!/usr/bin/env bash
# macOS/Linux counterpart of package-source.ps1: zips the source for upload.
set -euo pipefail

cd "$(dirname "$0")/.."

name=$(node -p "require('./package.json').name")
version=$(node -p "require('./package.json').version")
archive="artifacts/${name}-v${version}-$(date +%Y%m%d).zip"

mkdir -p artifacts
rm -f "$archive"

# Same exclusions as the PowerShell script, plus local TLS keys and macOS metadata.
zip -rqX "$archive" . \
  -x '.git/*' 'node_modules/*' '.next/*' 'artifacts/*' 'bun.lock' \
  -x '.env*' '*/.env*' \
  -x 'certificates/*' '.DS_Store' '*/.DS_Store'

echo "Created source package: $PWD/$archive"
