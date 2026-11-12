#!/usr/bin/env node
/**
 * Agrega un reel nuevo al sitio de Interforma.
 *
 * Uso:
 *   pnpm reel:add ./video.mp4 --id slug-seo --serie capsula \
 *     --caption "Texto corto" --seo-title "Título SEO" \
 *     --descripcion "Texto largo para la página"
 *
 * Opciones:
 *   --id           Slug para la URL (ej: que-es-agente-ia). Obligatorio.
 *   --serie        capsula | caso | serie | punto-en-accion. Obligatorio.
 *   --caption      Texto corto para el carrusel. Obligatorio.
 *   --seo-title    Título para la página individual y Google. Obligatorio.
 *   --descripcion  Texto editorial para la página y meta description. Obligatorio.
 *   --duracion     Duración ISO 8601 (ej: PT1M30S). Opcional.
 *   --instagram    URL del reel en Instagram. Opcional.
 *   --date         Fecha YYYY-MM-DD. Default: hoy.
 *   --dry-run      Muestra lo que haría sin ejecutar.
 *
 * Requisitos:
 *   - ffmpeg instalado
 *   - SUPABASE_ANON_KEY en .env (o como variable de entorno)
 */

import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, mkdtempSync } from 'node:fs';
import { basename, resolve, join } from 'node:path';
import { tmpdir } from 'node:os';

// ── Config ──────────────────────────────────────────
const SUPABASE_URL = 'https://iuamjwwgivnmgrqdjqas.supabase.co';
const BUCKET = 'reels';
const STORAGE_API = `${SUPABASE_URL}/storage/v1/object/${BUCKET}`;
const STORAGE_PUBLIC = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}`;
const REELS_CONFIG = resolve(import.meta.dirname, '..', 'src', 'config', 'reels.ts');
const SERIES_VALIDAS = ['capsula', 'caso', 'serie', 'punto-en-accion'];

// ── Parse args ──────────────────────────────────────
const args = process.argv.slice(2);

function getFlag(name) {
  const idx = args.indexOf(`--${name}`);
  if (idx === -1 || idx + 1 >= args.length) return undefined;
  return args[idx + 1];
}

const videoPath = args.find((a) => !a.startsWith('--') && a !== getFlag('id') && a !== getFlag('serie')
  && a !== getFlag('caption') && a !== getFlag('seo-title') && a !== getFlag('descripcion')
  && a !== getFlag('duracion') && a !== getFlag('instagram') && a !== getFlag('date'));

const id = getFlag('id');
const serie = getFlag('serie');
const caption = getFlag('caption');
const seoTitle = getFlag('seo-title');
const descripcion = getFlag('descripcion');
const duracion = getFlag('duracion');
const instagram = getFlag('instagram');
const date = getFlag('date') || new Date().toISOString().slice(0, 10);
const dryRun = args.includes('--dry-run');

// ── Validate ────────────────────────────────────────
const errors = [];
if (!videoPath || !existsSync(videoPath)) errors.push('Archivo .mp4 no encontrado. Uso: pnpm reel:add ./video.mp4 --id ...');
if (!id) errors.push('--id es obligatorio (slug para la URL)');
if (!serie || !SERIES_VALIDAS.includes(serie)) errors.push(`--serie es obligatorio (${SERIES_VALIDAS.join(' | ')})`);
if (!caption) errors.push('--caption es obligatorio');
if (!seoTitle) errors.push('--seo-title es obligatorio');
if (!descripcion) errors.push('--descripcion es obligatorio');

if (errors.length) {
  console.error('\n❌ Errores:\n');
  errors.forEach((e) => console.error(`  • ${e}`));
  console.error('\nUso: pnpm reel:add ./video.mp4 --id slug --serie capsula --caption "..." --seo-title "..." --descripcion "..."\n');
  process.exit(1);
}

// Check ffmpeg
try {
  execSync('which ffmpeg', { stdio: 'ignore' });
} catch {
  console.error('❌ ffmpeg no encontrado. Instálalo con: brew install ffmpeg');
  process.exit(1);
}

// Check for duplicate ID
const configContent = readFileSync(REELS_CONFIG, 'utf-8');
if (configContent.includes(`id: '${id}'`)) {
  console.error(`❌ Ya existe un reel con id '${id}' en reels.ts`);
  process.exit(1);
}

// ── Get Supabase key ────────────────────────────────
let supabaseKey = process.env.SUPABASE_ANON_KEY;
if (!supabaseKey) {
  const envPath = resolve(import.meta.dirname, '..', '.env');
  if (existsSync(envPath)) {
    const envContent = readFileSync(envPath, 'utf-8');
    const match = envContent.match(/^SUPABASE_ANON_KEY=(.+)$/m);
    if (match) supabaseKey = match[1].trim();
  }
}
if (!supabaseKey) {
  console.error('❌ SUPABASE_ANON_KEY no encontrada. Agrégala a .env o como variable de entorno.');
  process.exit(1);
}

// ── File names ──────────────────────────────────────
const videoName = `${id}.mp4`;
const thumbName = `thumb-${id}.jpg`;

console.log(`\n📹 Reel: ${id}`);
console.log(`   Serie: ${serie}`);
console.log(`   Video: ${basename(videoPath)} → ${videoName}`);
console.log(`   Thumb: ${thumbName}`);
console.log(`   Fecha: ${date}\n`);

if (dryRun) {
  console.log('🏜️  Dry run — no se ejecutaron cambios.\n');
  process.exit(0);
}

// ── Generate thumbnail ──────────────────────────────
const tmpDir = mkdtempSync(join(tmpdir(), 'reel-'));
const thumbPath = join(tmpDir, thumbName);

console.log('🖼️  Generando thumbnail...');
execSync(`ffmpeg -y -ss 1 -i "${videoPath}" -vframes 1 -q:v 2 "${thumbPath}" 2>/dev/null`);

// ── Upload to Supabase ──────────────────────────────
function upload(filePath, remoteName, contentType) {
  const result = execSync(
    `curl -s -w "\\n%{http_code}" -X POST "${STORAGE_API}/${remoteName}" ` +
    `-H "Authorization: Bearer ${supabaseKey}" ` +
    `-H "Content-Type: ${contentType}" ` +
    `--data-binary @"${filePath}"`,
    { encoding: 'utf-8' },
  );
  const lines = result.trim().split('\n');
  const status = lines[lines.length - 1];
  if (status !== '200') {
    console.error(`❌ Error subiendo ${remoteName}: HTTP ${status}`);
    console.error(lines.slice(0, -1).join('\n'));
    process.exit(1);
  }
}

console.log('⬆️  Subiendo video...');
upload(videoPath, videoName, 'video/mp4');

console.log('⬆️  Subiendo thumbnail...');
upload(thumbPath, thumbName, 'image/jpeg');

// ── Update reels.ts ─────────────────────────────────
console.log('📝 Actualizando reels.ts...');

const escapeSingle = (s) => s.replace(/'/g, "\\'");

const newEntry = `  {
    id: '${id}',
    src: \`\${STORAGE}/${videoName}\`,
    poster: \`\${STORAGE}/${thumbName}\`,
    caption: '${escapeSingle(caption)}',
    serie: '${serie}',
    seoTitle: '${escapeSingle(seoTitle)}',
    descripcion: '${escapeSingle(descripcion)}',${duracion ? `\n    duracion: '${duracion}',` : ''}${instagram ? `\n    instagram: '${escapeSingle(instagram)}',` : ''}
    date: '${date}',
  },`;

// Insert at the beginning of the reels array (most recent first)
const updated = configContent.replace(
  /export const reels: Reel\[] = \[\n/,
  `export const reels: Reel[] = [\n${newEntry}\n`,
);

writeFileSync(REELS_CONFIG, updated, 'utf-8');

console.log(`\n✅ Reel '${id}' agregado correctamente.\n`);
console.log(`   Video:  ${STORAGE_PUBLIC}/${videoName}`);
console.log(`   Thumb:  ${STORAGE_PUBLIC}/${thumbName}`);
console.log(`   Página: https://interforma.digital/reels/${id}`);
console.log(`\n   Siguiente paso: git commit + git push\n`);
