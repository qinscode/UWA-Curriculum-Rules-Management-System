#!/bin/bash

echo "🔧 Fixing server build issues..."

# Clean all caches and build artifacts
echo "Cleaning caches..."
rm -rf .next
rm -rf .yarn/cache
rm -rf node_modules
rm -rf .pnp.cjs
rm -rf .pnp.loader.mjs

# Ensure .yarnrc.yml exists with correct configuration
echo "Setting up Yarn configuration..."
cat > .yarnrc.yml << EOF
nodeLinker: node-modules
enableGlobalCache: false
compressionLevel: mixed
EOF

# Install dependencies
echo "Installing dependencies..."
yarn install

# Generate Next.js types
echo "Generating Next.js types..."
yarn next build --debug

echo "✅ Server build fix complete!"
echo "Now run: yarn build"


