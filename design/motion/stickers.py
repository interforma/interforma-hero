"""Genera los 6 stickers animados de Punto (WebP 512×512, formato WhatsApp) y el ícono de bandeja.
Uso (desde design/motion): python3 stickers.py  → salida en out/stickers/"""
import io, os
from playwright.sync_api import sync_playwright
from PIL import Image
os.makedirs('out/stickers', exist_ok=True)
NAMES = ['hola', 'piensa', 'celebra', 'sorpresa', 'uy', 'ok']; N = 32
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 512, 'height': 512})
    pg.goto('file://' + os.getcwd() + '/engine.html'); pg.evaluate('window.ready')
    for n in NAMES:
        frames = []
        for i in range(N):
            pg.evaluate(f"sticker('{n}',{i/N})")
            frames.append(Image.open(io.BytesIO(pg.locator('#stage').screenshot(omit_background=True))).convert('RGBA'))
        frames[0].save(f'out/stickers/punto-{n}.webp', save_all=True, append_images=frames[1:],
                       duration=62, loop=0, quality=80, method=6)
    pg.set_viewport_size({'width': 96, 'height': 96}); pg.evaluate("sticker('hola',0,96)")
    pg.locator('#stage').screenshot(path='out/stickers/punto-bandeja-96.png', omit_background=True)
    b.close()
