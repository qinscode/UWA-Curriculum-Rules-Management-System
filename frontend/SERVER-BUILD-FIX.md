# Server Build Fix Instructions

## Issue
The frontend builds successfully locally but fails on the server with the error:
```
Cannot find module 'next/dist/lib/metadata/types/metadata-interface.js' or its corresponding type declarations.
```

## Solution Steps

### Method 1: Quick Fix Script (Recommended)
Run the automated fix script:
```bash
cd frontend
chmod +x fix-server-build.sh
./fix-server-build.sh
```

### Method 2: Manual Steps

1. **Clean everything completely:**
```bash
cd frontend
rm -rf .next
rm -rf .yarn/cache  
rm -rf node_modules
rm -rf .pnp.cjs
rm -rf .pnp.loader.mjs
```

2. **Create/verify .yarnrc.yml configuration:**
```bash
cat > .yarnrc.yml << EOF
nodeLinker: node-modules
enableGlobalCache: false
compressionLevel: mixed
EOF
```

3. **Install dependencies with node_modules:**
```bash
yarn install
```

4. **Build the project:**
```bash
yarn build
```

## What These Fixes Do

1. **Disable Yarn PnP**: Forces Yarn to use traditional node_modules instead of Plug'n'Play mode
2. **Clean Module Resolution**: Uses Node.js module resolution strategy in TypeScript
3. **Type Declarations**: Adds fallback type declarations for problematic Next.js internal modules
4. **Cache Prevention**: Disables global cache to prevent cross-environment conflicts

## Files Modified

- `.yarnrc.yml` - Yarn configuration
- `tsconfig.json` - TypeScript module resolution
- `types/next-metadata.d.ts` - Fallback type declarations
- `fix-server-build.sh` - Automated fix script

## Verification

After running the fix, you should see:
```bash
✓ Compiled successfully
✓ Generating static pages (13/13)
✓ Finalizing page optimization
```

If the issue persists, check:
1. Node.js version (should be 18+ for Next.js 14)
2. Yarn version compatibility
3. Available disk space for node_modules installation


