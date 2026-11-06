"""Genera public/marca/punto-firma.gif: Punto y sus estados para la firma de correo.

Geometría = src/lib/punto.ts (viewBox 200u, cuerpo r=72 en 100,108). Punto es un
personaje aparte: el isotipo de la firma no cambia y nunca lleva ojos.

Secuencia (se reproduce una vez, ~6 s, y queda en "atento"):
  atento (primer cuadro: Outlook de escritorio solo muestra este) → parpadea →
  saluda (se balancea) → piensa (mira arriba, puntos) → celebra (salta, confeti)
  → atento.
Uso: python3 scripts/punto-gif.py
"""
import math
from PIL import Image, ImageDraw

OUT = 120            # px del GIF (se muestra a 40 px en la firma: 3x para retina)
SS = 4               # supersampling
K = OUT * SS / 200   # px por unidad del viewBox
INK, ENERGIA, PAPEL, CIELO = (40, 31, 24), (238, 110, 67), (242, 241, 238), (204, 226, 237)
BG_KEY = 23

def lerp(a, b, t): return a + (b - a) * t
def ease_io(t): return t * t * (3 - 2 * t)
def ease_out(t): return 1 - (1 - t) ** 3

def P(x, y): return (x * K, y * K)

def ellipse(d, cx, cy, rx, ry, fill):
    d.ellipse([(cx - rx) * K, (cy - ry) * K, (cx + rx) * K, (cy + ry) * K], fill=fill)

def stroke(d, pts, w, fill=INK):
    """Polilínea con extremos y uniones redondeadas."""
    xy = [P(*p) for p in pts]
    d.line(xy, fill=fill, width=round(w * K), joint="curve")
    r = w / 2
    for x, y in pts:
        ellipse(d, x, y, r, r, fill)

def eyes(d, expr, dx=0, dy=0, blink=1.0):
    """blink: 1 = abiertos, 0 = cerrados (solo ojos ovalados)."""
    if expr == "piensa":
        for x in (94, 126):
            ellipse(d, x + dx, 92 + dy, 9, max(1.5, 16 * blink), INK)
    elif expr == "celebra":
        for x in (70, 106):
            stroke(d, [(x + dx, 102 + dy), (x + 12 + dx, 88 + dy), (x + 24 + dx, 102 + dy)], 7)
    else:  # atento / saluda
        for x in (82, 118):
            ellipse(d, x + dx, 100 + dy, 9, max(1.5, 16 * blink), INK)

def frame(expr="atento", rot=0.0, lift=0.0, look=0.0, blink=1.0, decor=0.0, scale=1.0):
    """decor: 0..1 progreso de los elementos alrededor (flick, puntos, confeti)."""
    big = Image.new("RGBA", (OUT * SS, OUT * SS), (0, 0, 0, 0))
    d = ImageDraw.Draw(big)
    d.rounded_rectangle([0, 0, OUT * SS - 1, OUT * SS - 1], radius=44 * K, fill=PAPEL)

    # Cuerpo en su propia capa para poder rotarlo/levantarlo.
    body = Image.new("RGBA", big.size, (0, 0, 0, 0))
    b = ImageDraw.Draw(body)
    r = 72 * scale
    ellipse(b, 100, 108, r, r, ENERGIA)
    eyes(b, expr, dx=look, blink=blink)
    if rot:
        body = body.rotate(rot, resample=Image.BICUBIC, center=P(100, 180))
    big.alpha_composite(body, (0, round(-lift * K)))

    if expr == "saluda" and decor > 0:
        a = ease_out(min(1, decor))
        for (x1, y1, x2, y2) in ((172, 40, 182, 30), (178, 58, 192, 55), (158, 28, 161, 15)):
            stroke(d, [(x1, y1), (lerp(x1, x2, a), lerp(y1, y2, a))], 4)
    if expr == "piensa":
        for i, (x, y, rr) in enumerate(((160, 40, 5), (174, 24, 6.5), (190, 8, 8))):
            t = max(0, min(1, decor * 3 - i))
            if t > 0:
                ellipse(d, x, y + 6, rr * ease_out(t), rr * ease_out(t), INK)
    if expr == "celebra" and decor > 0:
        a = ease_out(min(1, decor))
        for (x, y, s, dx, dy) in ((20, 32, 12, -6, -8), (177, 25, 10, 6, -8)):
            x, y = x + dx * a, y + dy * a + 8
            h = s * a / 2
            d.rounded_rectangle([(x - h) * K, (y - h) * K, (x + h) * K, (y + h) * K], radius=2 * K, fill=INK)
        ellipse(d, 28 - 4 * a, 150 + 4 * a, 5 * a, 5 * a, INK)

    im = big.resize((OUT, OUT), Image.LANCZOS)
    alpha = im.split()[3].point(lambda v: 255 if v >= 128 else 0)
    flat = Image.new("RGB", im.size, PAPEL); flat.paste(im, mask=im.split()[3])
    p = flat.quantize(colors=BG_KEY, method=Image.MEDIANCUT)
    p.paste(BG_KEY, mask=alpha.point(lambda v: 255 - v))
    p.info["transparency"] = BG_KEY
    return p

frames, durations = [], []
def add(f, ms): frames.append(f); durations.append(ms)

# 1. Atento: espera mientras el isotipo de la firma se arma (~1,6 s)
add(frame("atento"), 1500)
for t in (0.4, 0.0, 0.5):                       # parpadeo
    add(frame("atento", blink=t), 50)
add(frame("atento"), 250)

# 2. Saluda: se balancea dos veces, aparecen las líneas
N = 22
for i in range(1, N + 1):
    t = i / N
    add(frame("saluda", rot=8 * math.sin(t * 2 * math.pi * 2) * (1 - 0.3 * t), decor=t * 2), 40)
add(frame("saluda", decor=1), 350)

# 3. Piensa: mira arriba a la derecha, aparecen los tres puntos
for i in range(1, 6):
    add(frame("atento", look=4 * ease_io(i / 5)), 40)
N = 18
for i in range(1, N + 1):
    add(frame("piensa", decor=i / N), 45)
add(frame("piensa", decor=1), 600)

# 4. Celebra: se agacha, salta con ojos felices y confeti
for i in range(1, 4):
    add(frame("atento", scale=1 - 0.03 * i / 3, lift=-2 * i / 3), 40)
N = 16
for i in range(1, N + 1):
    t = i / N
    add(frame("celebra", lift=16 * math.sin(math.pi * t), decor=t * 1.5), 40)
for i in range(1, 6):                            # pequeño rebote
    add(frame("celebra", lift=4 * math.sin(math.pi * i / 5), decor=1), 40)
add(frame("celebra", decor=1), 600)

# 5. Vuelve a atento y queda fijo
for t in (0.0, 0.6):
    add(frame("atento", blink=t), 50)
add(frame("atento"), 60000)

frames[0].save("public/marca/punto-firma.gif", save_all=True, append_images=frames[1:],
               duration=durations, loop=1, disposal=2, optimize=True)
print(len(frames), "cuadros,", round(sum(durations[:-1]) / 1000, 1), "s")
