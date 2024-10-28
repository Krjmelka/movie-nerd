const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

async function build() {
  const entryPoints = fs.readdirSync(path.join(__dirname, 'src/handlers'))
    .filter(file => file.endsWith('.ts') && file !== 'index.ts')
    .map(file => path.join(__dirname, 'src/handlers', file));

  await esbuild.build({
    entryPoints,
    bundle: true,
    platform: 'node',
    target: 'node14',
    outdir: 'dist',
    format: 'cjs',
    sourcemap: false,
    external: ['aws-sdk'],
  });
}

build().catch(() => process.exit(1));