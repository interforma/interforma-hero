/**
 * fix-vercel-runtime.mjs
 *
 * @astrojs/vercel@7 hardcodes nodejs18.x when it can't detect
 * a supported local Node version. Vercel Hobby no longer allows 18.
 * This script patches .vc-config.json files to use nodejs20.x.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const FUNCTIONS_DIR = '.vercel/output/functions';
const TARGET_RUNTIME = 'nodejs20.x';

if (!existsSync(FUNCTIONS_DIR)) process.exit(0);

for (const entry of readdirSync(FUNCTIONS_DIR, { withFileTypes: true })) {
  if (!entry.isDirectory() || !entry.name.endsWith('.func')) continue;
  const configPath = join(FUNCTIONS_DIR, entry.name, '.vc-config.json');
  if (!existsSync(configPath)) continue;

  const config = JSON.parse(readFileSync(configPath, 'utf8'));
  if (config.runtime && config.runtime !== TARGET_RUNTIME) {
    console.log(`Patching ${configPath}: ${config.runtime} → ${TARGET_RUNTIME}`);
    config.runtime = TARGET_RUNTIME;
    writeFileSync(configPath, JSON.stringify(config, null, '\t') + '\n');
  }
}
