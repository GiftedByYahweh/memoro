import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const nodeRequire = createRequire(import.meta.url);
const currentDir = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(currentDir, '../public');

const TARGET_FILES = [
  'maplibre-gl/dist/maplibre-gl-worker.mjs',
  'maplibre-gl/dist/maplibre-gl-shared.mjs',
] as const;

function copyWorkerAssets(): void {
  if (!existsSync(publicDir)) {
    mkdirSync(publicDir, { recursive: true });
  }

  for (const target of TARGET_FILES) {
    const fileName = target.split('/').at(-1);
    if (!fileName) continue;

    const destinationPath = resolve(publicDir, fileName);
    if (existsSync(destinationPath)) continue;

    const sourcePath = nodeRequire.resolve(target);
    copyFileSync(sourcePath, destinationPath);
  }
}

copyWorkerAssets();
