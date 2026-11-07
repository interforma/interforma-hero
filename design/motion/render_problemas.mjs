// Reel 9:16 de «¿Le suena familiar?» a partir del componente real del sitio.
//
// La animación vive en src/sections/ProblemsSection.astro. Con ?ps-render=reel
// el componente pasa a composición vertical con título, subtítulos y marca, y
// expone window.psRender(t) para dibujar cualquier instante.
//
// Uso (con el sitio construido y servido, p. ej. en http://localhost:4321):
//   node render_problemas.mjs <url> sheet out/revision → 14 cuadros sueltos para revisar
//   node render_problemas.mjs <url> frames out/problemas  → JPG a 30 fps, 1080×1920
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const [base, mode = 'sheet', out = 'out/problemas'] = process.argv.slice(2);
const FPS = 30;
const HOLD = 1.5; // segundos extra al final, congelados sobre el cierre

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 450, height: 800 }, deviceScaleFactor: 2.4 });
await page.goto(`${base}/?ps-render=reel`, { waitUntil: 'networkidle' });
// Solo el escenario, a pantalla completa y sin controles ni elementos flotantes.
await page.addStyleTag({
  content: `
    body > *:not(main), header, footer, .wa-float, [class*="punto-bubble"] { display: none !important; }
    .ps-stage { position: fixed !important; inset: 0 !important; z-index: 99999; border: 0 !important; border-radius: 0 !important; }
    .ps-controls { display: none !important; }
    .ps-svg { width: 100vw !important; height: 100vh !important; }
  `,
});
await page.evaluate(() => document.fonts.ready);
const total = await page.evaluate(() => window.psTotal);

if (mode === 'sheet') {
  // Cuadros sueltos para revisar antes de renderizar todo.
  const times = [1.2, 3.5, 6.5, 8.5, 11.5, 13.5, 16, 18.5, 21, 23, 26, 28.5, 31, 33];
  mkdirSync(out, { recursive: true });
  for (const t of times) {
    await page.evaluate((x) => window.psRender(x), t);
    await page.screenshot({ path: `${out}/sheet-${String(t).replace('.', '_')}.jpg`, type: 'jpeg', quality: 85 });
  }
  console.log('cuadros de revisión en', out);
} else {
  mkdirSync(out, { recursive: true });
  const n = Math.round((total + HOLD) * FPS);
  for (let i = 0; i < n; i++) {
    const t = Math.min(i / FPS, total - 0.001);
    // En el hold final se congela el último cuadro del cierre.
    await page.evaluate((x) => window.psRender(x), i / FPS >= total - 0.6 ? total - 0.6 : t);
    await page.screenshot({ path: `${out}/f${String(i).padStart(5, '0')}.jpg`, type: 'jpeg', quality: 92 });
  }
  console.log('cuadros:', n, 'duración:', (n / FPS).toFixed(2), 's');
}
await browser.close();
