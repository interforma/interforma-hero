"""Música y efectos del reel «¿Le suena familiar?» (34,7 s), originales y sintetizados.

Lo-fi curioso a 96 bpm en re menor durante los seis problemas; en el cierre
resuelve a fa mayor con campanas. Los efectos usan la misma lista de eventos
que el sitio (EVENTS en src/sections/ProblemsSection.astro): si cambian los
tiempos allá, se actualizan aquí.

Uso:  python3 audio_problemas.py   → audio_problemas.wav
"""
import numpy as np
from scipy.signal import butter, sosfilt
from scipy.io import wavfile

SR = 48000
DUR_SCENES = [4.6, 4.6, 5.0, 4.4, 4.6, 4.8, 5.2]      # igual que DUR del componente
START = [sum(DUR_SCENES[:i]) for i in range(len(DUR_SCENES))]
TOTAL = sum(DUR_SCENES)
LENGTH = TOTAL + 1.5                                   # + hold final del render
N = int(SR * LENGTH)
L = np.zeros(N); R = np.zeros(N); rng = np.random.default_rng(7)
hz = lambda m: 440.0 * 2 ** ((m - 69) / 12)
BEAT = 60 / 96

# ── Caja de herramientas (misma familia que audio_cap04.py) ─────────
def put(sig, t0, pan=0.0):
    i = int(t0 * SR)
    if i >= N or i < 0: return
    sig = sig[: N - i]
    L[i:i+len(sig)] += sig * np.cos((pan + 1) * np.pi / 4)
    R[i:i+len(sig)] += sig * np.sin((pan + 1) * np.pi / 4)

def pluck(m, amp=.2, dec=1.0, bright=1.0):
    f = hz(m); t = np.arange(int(dec * 2.5 * SR)) / SR
    s = sum(a * np.sin(2*np.pi*f*k*(1+.0004*k*k)*t) * np.exp(-t/dec*(1+(k-1)*.9/bright))
            for k, a in enumerate([1, .45, .22, .12, .06], start=1))
    return amp * s * np.minimum(1, t / .003)

def marimba(m, amp=.15, dec=.35):
    f = hz(m); t = np.arange(int(dec * 4 * SR)) / SR
    s = np.sin(2*np.pi*f*t)*np.exp(-t/dec) + .35*np.sin(2*np.pi*f*4*t)*np.exp(-t/(dec*.25))
    return amp * s * np.minimum(1, t / .002)

def bell(m, amp=.08, dec=1.2):
    f = hz(m); t = np.arange(int(dec * 3 * SR)) / SR
    return amp * sum(a*np.sin(2*np.pi*f*r*t)*np.exp(-t/(dec*d)) for r, a, d in [(1,1,1),(2.76,.4,.5),(5.4,.2,.3)])

def pad(ms, t0, t1, amp=.05, a=.6, r=.8, bright=3):
    t = np.arange(int((t1 - t0 + r) * SR)) / SR; s = np.zeros_like(t)
    for m in ms:
        for d in (-.07, .07):
            for k in range(1, bright + 1):
                s += np.sin(2*np.pi*hz(m+d)*k*t + rng.uniform(0, 6)) / k**1.6
    s /= len(ms) * 2
    e = np.ones_like(t); na = int(a*SR); e[:na] = np.linspace(0, 1, na)**2
    r0 = int((t1-t0)*SR); e[r0:] = np.linspace(1, 0, len(e)-r0)**2
    put(amp * s * e, t0)

def glide(t0, f0, f1, d, amp=.1):
    t = np.arange(int(d*SR)) / SR; f = np.linspace(f0, f1, len(t))
    put(amp * np.sin(2*np.pi*np.cumsum(f)/SR) * np.sin(np.pi*t/d), t0)

def swoosh(t0, d=.4, amp=.1):
    n = int(d*SR); x = rng.standard_normal(n)
    x = sosfilt(butter(2, [700, 4500], btype='band', fs=SR, output='sos'), x)
    put(amp * x * np.sin(np.pi*np.linspace(0, 1, n))**2 / np.max(np.abs(x)), t0)

def click(t0, amp=.05, f=2400):
    t = np.arange(int(.03*SR)) / SR; put(amp*np.sin(2*np.pi*f*t)*np.exp(-t*180), t0)

def thump(t0, amp=.25):
    t = np.arange(int(.4*SR)) / SR; f = 110*np.exp(-t*10) + 48
    put(amp*np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*9), t0)

def hat(t0, amp=.018):
    n = int(.05*SR); x = sosfilt(butter(2, 7000, btype='high', fs=SR, output='sos'), rng.standard_normal(n))
    put(amp * x * np.exp(-np.arange(n)/SR*70), t0, pan=.25)

# ── Música ───────────────────────────────────────────────────────
close = START[6]
# Progresión de los problemas (re menor curioso): Dm – Bb – F – C, 2 compases cada uno
prog = [[50, 57, 62, 65], [46, 53, 62, 65], [53, 57, 60, 65], [48, 55, 60, 64]]
bar = BEAT * 4
t = 0.0; k = 0
while t < close - 0.2:
    ch = prog[k % 4]
    pad(ch, t, min(t + bar * 2, close), amp=.035, a=.5, r=.6, bright=2)
    put(pluck(ch[0] - 12, amp=.10, dec=.7), t)
    put(pluck(ch[0] - 12, amp=.07, dec=.5), t + BEAT * 2.5)
    t += bar * 2; k += 1

# Pulso suave: bombo en 1 y 3, hi-hat en corcheas (entra a los 2 s)
b = 2.0
while b < close - 0.1:
    thump(b, amp=.07) if int(round((b - 2.0) / BEAT)) % 2 == 0 else None
    hat(b); hat(b + BEAT / 2, amp=.01)
    b += BEAT

# Motivo de marimba que «pregunta» (sube y queda en el aire) al inicio de cada problema
for s in START[:6]:
    for j, m in enumerate([74, 77, 79, 81]):
        put(marimba(m, amp=.05, dec=.28), s + .15 + j * BEAT / 2, pan=-.2)

# Cierre: resuelve en fa mayor con campanas
pad([53, 57, 60, 65, 69], close, LENGTH - .3, amp=.05, a=.8, r=.3, bright=3)
for j, m in enumerate([77, 81, 84, 89]):
    put(bell(m, amp=.05, dec=1.4), close + .4 + j * .28, pan=(j - 1.5) * .25)

# ── Efectos sincronizados con la animación ───────────────────────
EVENTS = [
    (0, .24, 'thump'), (0, .5, 'pop'),
    (1, .04, 'swish'), (1, .42, 'swish'), (1, .55, 'pop'),
    (2, .1, 'tick'), (2, .18, 'tick'), (2, .26, 'tick'), (2, .34, 'pop'), (2, .58, 'tick'), (2, .68, 'tick'), (2, .78, 'tick'),
    *[(3, .05 + k * .8 / 9, 'tick') for k in range(1, 9)],
    (4, .28, 'bonk'), (4, .31, 'pop'), (4, .66, 'bonk'),
    (5, .4, 'snap'), (5, .76, 'snap'), (5, .77, 'pop'),
    (6, .1, 'chime'),
]
for scene, p, fx in EVENTS:
    t0 = START[scene] + p * DUR_SCENES[scene]
    if fx == 'thump':
        thump(t0, amp=.32); swoosh(t0 - .25, d=.25, amp=.05)
    elif fx == 'pop':
        glide(t0, 520, 900, .12, amp=.09)
    elif fx == 'swish':
        swoosh(t0, d=.4, amp=.09)
    elif fx == 'tick':
        click(t0, amp=.045, f=2300)
    elif fx == 'bonk':
        put(marimba(45, amp=.22, dec=.18), t0); thump(t0, amp=.12)
    elif fx == 'snap':
        click(t0, amp=.07, f=1100); glide(t0 + .02, 700, 260, .12, amp=.05)
    elif fx == 'chime':
        put(bell(84, amp=.07, dec=1.6), t0)

# ── Mezcla ───────────────────────────────────────────────────────
mix = np.stack([L, R], axis=1)
fade = int(.8 * SR); mix[-fade:] *= np.linspace(1, 0, fade)[:, None]
mix /= max(1e-9, np.max(np.abs(mix))) / .89
wavfile.write('audio_problemas.wav', SR, (mix * 32767).astype(np.int16))
print(f'audio_problemas.wav · {LENGTH:.2f} s')
