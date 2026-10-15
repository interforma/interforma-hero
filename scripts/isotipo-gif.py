"""Genera public/marca/isotipo-animado.gif para la firma de correo.

Geometría = public/marca/isotipo.svg (viewBox 120u). El primer cuadro es el
logo completo (Outlook de escritorio solo muestra el primer cuadro); luego los
módulos vuelven a la base y una copia sube la diagonal hasta el círculo Energía.
Se reproduce una sola vez. Uso: python3 scripts/isotipo-gif.py
"""
from PIL import Image, ImageDraw

OUT = 96             # px del GIF (se muestra a 18-24 px en la firma)
SS = 4               # supersampling
U = OUT * SS / 120   # px por unidad
UMBRA, PAPEL, ENERGIA = (40, 31, 24), (242, 241, 238), (238, 110, 67)
STEP, SIZE = 31, 32
A = (13, 75)

def lerp(a, b, t): return a + (b - a) * t
def mix(c1, c2, t): return tuple(round(lerp(x, y, t)) for x, y in zip(c1, c2))
def ease_io(t): return t * t * (3 - 2 * t)
def ease_out(t): return 1 - (1 - t) ** 3
def ease_in(t): return t ** 2.2

def module(d, step, rx, color):
    x, y = A[0] + STEP * step, A[1] - STEP * step
    d.rounded_rectangle([x * U, y * U, (x + SIZE) * U, (y + SIZE) * U], radius=rx * U, fill=color)

def frame(b_step, c_step, b_vis=True, c_vis=True):
    big = Image.new("RGBA", (OUT * SS, OUT * SS), (0, 0, 0, 0))
    d = ImageDraw.Draw(big)
    d.rounded_rectangle([0, 0, OUT * SS - 1, OUT * SS - 1], radius=28 * U, fill=UMBRA)
    module(d, 0, 4, PAPEL)
    if b_vis: module(d, b_step, lerp(4, 10, b_step), PAPEL)
    if c_vis:
        r = lerp(4, 10, c_step) if c_step <= 1 else lerp(10, 16, c_step - 1)
        col = PAPEL if c_step <= 1 else mix(PAPEL, ENERGIA, c_step - 1)
        module(d, c_step, r, col)
    im = big.resize((OUT, OUT), Image.LANCZOS)
    alpha = im.split()[3].point(lambda a: 255 if a >= 128 else 0)
    flat = Image.new("RGB", im.size, UMBRA); flat.paste(im, mask=im.split()[3])
    p = flat.quantize(colors=63, method=Image.MEDIANCUT)
    p.paste(63, mask=alpha.point(lambda a: 255 - a))
    p.info["transparency"] = 63
    return p

frames, durations = [], []
def add(f, ms): frames.append(f); durations.append(ms)

add(frame(1, 2), 700)                       # logo completo (primer cuadro)
for i in range(1, 7):                       # recogida rápida hacia la base
    t = ease_io(i / 6); add(frame(1 - t, 2 - 2 * t), 30)
add(frame(0, 0, False, False), 160)         # solo el módulo base
N = 30                                      # subida: ~1,2 s
for i in range(1, N + 1):
    t = i / N
    b = ease_io(min(1, t / 0.55))
    c = 2 * (ease_in(t / 0.5) * 0.5 if t < 0.5 else 0.5 + ease_out((t - 0.5) / 0.5) * 0.5)
    add(frame(b, c), 40)
durations[-1] = 60000                       # queda fijo al final

frames[0].save("public/marca/isotipo-animado.gif", save_all=True, append_images=frames[1:],
               duration=durations, loop=1, disposal=2, optimize=True)
print("ok")
