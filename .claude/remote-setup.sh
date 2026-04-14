#!/bin/bash
set -e

if [ "$CLAUDE_CODE_REMOTE" != "true" ]; then
	exit 0
fi

echo "==> Checking gh authentication..."
gh auth status || { echo "ERROR: gh not authenticated"; exit 1; }

if [ ! -d "node_modules" ]; then
	echo "==> Installing dependencies..."
	corepack enable && pnpm install
else
	echo "==> Dependencies already installed, skipping."
fi

echo "==> Fetching .env from Gist..."
if [ -z "$SECRETS_GIST_ID" ]; then
	echo "ERROR: SECRETS_GIST_ID environment variable is not set"
	exit 1
fi
tmp_env="$(mktemp)"
gh gist view "$SECRETS_GIST_ID" --raw > "$tmp_env" || { echo "ERROR: Failed to fetch .env"; rm -f "$tmp_env"; exit 1; }
chmod 600 "$tmp_env"
mv "$tmp_env" .env

echo "==> Applying DB migrations..."
pnpm db:apply:local

echo "==> Remote setup complete."
