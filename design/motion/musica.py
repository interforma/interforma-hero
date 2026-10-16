"""Original score for "La semilla" (50 s), synthesized from scratch.

It follows the story's beats: night and drops → roots → dawn → five leaves (an
ascending melody) → buildup → bloom → Punto (a playful motif) → reveal →
resolution on the logo. Key: D major.
"""
import numpy as np
from scipy.signal import fftconvolve, butter, sosfilt
from scipy.io import wavfile

SR = 48000
DUR = 50.0
N = int(SR * DUR)
L = np.zeros(N); R = np.zeros(N)
rng = np.random.default_rng(7)

hz = lambda m: 440.0 * 2 ** ((m - 69) / 12)

def put(sig, t0, pan=0.0):
    i = int(t0 * SR)
    if i >= N: return
    sig = sig[: N - i]
    gl, gr = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    L[i:i + len(sig)] += sig * gl
    R[i:i + len(sig)] += sig * gr

def env_adsr(n, a, r, sustain_len):
    e = np.ones(n)
    na, nr = int(a * SR), int(r * SR)
    if na: e[:na] = np.linspace(0, 1, na) ** 2
    if nr: e[-nr:] *= np.linspace(1, 0, nr) ** 2
    return e

def pluck(m, amp=0.2, dec=1.6, bright=1.0, dur=None):
    """Electric piano / kalimba: harmonics that decay faster the higher they go."""
    f = hz(m); dur = dur or dec * 2.2
    t = np.arange(int(dur * SR)) / SR
    s = np.zeros_like(t)
    for k, a in enumerate([1, .45, .22, .12, .06, .03], start=1):
        fk = f * k * (1 + 0.0004 * k * k)
        s += a * np.sin(2 * np.pi * fk * t) * np.exp(-t * (1 / dec) * (1 + (k - 1) * 0.9 / bright))
    s *= np.minimum(1, t / 0.004)
    return amp * s

def bell(m, amp=0.12, dec=3.0):
    f = hz(m); t = np.arange(int(dec * 2.5 * SR)) / SR
    s = sum(a * np.sin(2 * np.pi * f * r * t) * np.exp(-t / (dec * d))
            for r, a, d in [(1, 1, 1), (2.76, .4, .5), (5.40, .2, .3), (8.93, .1, .2)])
    return amp * s * np.minimum(1, t / 0.002)

def pad(ms, t0, t1, amp=0.05, a=1.5, r=2.0, bright=4):
    """Soft pad: slightly detuned voices, few harmonics, slow fades."""
    dur = t1 - t0 + r
    t = np.arange(int(dur * SR)) / SR
    s = np.zeros_like(t)
    for m in ms:
        for det in (-0.06, 0.06):
            f = hz(m + det)
            for k in range(1, bright + 1):
                s += (1 / k ** 1.6) * np.sin(2 * np.pi * f * k * t + rng.uniform(0, 6))
    s /= len(ms) * 2
    e = np.ones_like(t)
    na = int(a * SR); e[:na] = np.linspace(0, 1, na) ** 2
    rel0 = int((t1 - t0) * SR); e[rel0:] = np.linspace(1, 0, len(e) - rel0) ** 2
    lfo = 1 + 0.08 * np.sin(2 * np.pi * 0.18 * t)
    return amp * s * e * lfo

def noise_swell(t0, t1, amp=0.05):
    n = int((t1 - t0) * SR)
    x = rng.standard_normal(n)
    sos = butter(2, [800, 6000], btype='band', fs=SR, output='sos')
    x = sosfilt(sos, x)
    e = np.linspace(0, 1, n) ** 3
    return amp * x * e / np.max(np.abs(x))

def bloop(t0, f0=520, f1=980, d=0.16, amp=0.10):
    t = np.arange(int(d * SR)) / SR
    f = np.linspace(f0, f1, len(t))
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / d)
    put(amp * s, t0)

def thump(t0, amp=0.35):
    t = np.arange(int(0.6 * SR)) / SR
    f = 90 * np.exp(-t * 6) + 45
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7)
    put(amp * s, t0)

# ---------- 1 · Noche (0–12 s) ----------
put(pad([38, 45, 50], 0.0, 12.5, amp=0.13, a=3.0, r=3.0, bright=2), 0.0)
for t0, m, p in [(5.75, 86, -.3), (6.65, 81, .3), (7.55, 90, -.1), (8.45, 88, .2)]:  # gotas
    put(pluck(m, amp=0.10, dec=0.5, bright=2), t0, p)
    put(bell(m + 12, amp=0.025, dec=0.6), t0, p)
for t0, m in [(6.0, 50), (8.4, 57), (9.6, 47), (10.8, 54)]:  # raíces
    put(pluck(m, amp=0.16, dec=2.4, bright=0.6), t0)

# ---------- 2 · Amanecer y crecimiento (12.5–30.6 s) ----------
CH = [(12.5, [50, 54, 57]), (16.5, [47, 50, 54]), (20.5, [43, 47, 50]), (24.5, [45, 49, 52]),
      (28.5, [45, 50, 52]), (29.9, [45, 49, 52])]
for i, (t0, ch) in enumerate(CH):
    t1 = CH[i + 1][0] if i + 1 < len(CH) else 30.6
    grow = (t0 - 12.5) / 18
    put(pad(ch + [ch[0] - 12], t0, t1 + 0.3, amp=0.08 + 0.05 * grow, a=1.2, r=1.2, bright=3 + int(grow * 3)), t0)

def chord_at(t):
    c = CH[0][1]
    for t0, ch in CH:
        if t >= t0: c = ch
    return c

t = 12.5; i = 0
pattern = [0, 1, 2, 3, 2, 1]
while t < 30.4:
    ch = chord_at(t); notes = [ch[0] + 12, ch[1] + 12, ch[2] + 12, ch[0] + 24]
    m = notes[pattern[i % len(pattern)]]
    grow = min(1, (t - 12.5) / 16)
    put(pluck(m, amp=0.055 + 0.04 * grow, dec=0.9, bright=1.2), t, pan=0.35 * np.sin(i * 0.7))
    t += 0.5; i += 1

for t0, m in [(18.5, 74), (20.5, 76), (22.5, 78), (24.5, 81), (26.5, 83)]:  # hojas
    put(pluck(m, amp=0.16, dec=2.0, bright=1.5), t0)
    put(bell(m + 12, amp=0.04, dec=1.5), t0 + 0.01)

put(noise_swell(28.0, 30.6, amp=0.06), 28.0)

# ---------- 3 · Floración (30.6 s) ----------
for j, m in enumerate([38, 45, 50, 54, 57, 62, 66, 69, 74]):
    put(pluck(m, amp=0.12, dec=3.2, bright=1.2), 30.6 + j * 0.028, pan=(j - 4) / 6)
for m, d in [(86, 0), (93, .08), (90, .16), (98, .3)]:
    put(bell(m, amp=0.05, dec=2.2), 30.6 + d, pan=.4 if d else -.4)
put(pad([38, 50, 54, 57, 62], 30.5, 33.4, amp=0.11, a=0.15, r=1.6, bright=5), 30.5)

# ---------- 4 · Punto (33–39.5 s) ----------
put(pad([50, 54, 57], 33.2, 36.6, amp=0.07, a=1.0, r=1.2, bright=3), 33.2)
put(pad([43, 47, 50], 36.6, 39.6, amp=0.08, a=0.8, r=1.2, bright=3), 36.6)
bloop(33.15)                                   # abre los ojos
for t0, m in [(34.35, 88), (35.05, 86)]:       # mira a los lados
    put(pluck(m, amp=0.06, dec=0.18, bright=3), t0, pan=-.5 if m == 88 else .5)
for t0 in (35.55, 38.7):                       # parpadeos
    bloop(t0, 900, 700, 0.07, 0.05)
for j, m in enumerate([81, 78, 74, 78, 81, 83, 81, 78]):   # saluda
    put(pluck(m, amp=0.09, dec=0.45, bright=2), 35.85 + j * 0.25, pan=0.3 * (-1) ** j)

# ---------- 5 · Revelación y firma (39.6–50 s) ----------
for j, m in enumerate([86, 81, 78, 74]):
    put(pluck(m, amp=0.08, dec=1.2, bright=1.3), 39.6 + j * 0.3)
put(pad([47, 50, 54], 39.5, 41.6, amp=0.05, a=0.8, r=1.0), 39.5)
put(pad([43, 47, 50, 55], 41.5, 42.8, amp=0.05, a=0.6, r=0.6), 41.5)
thump(42.6)
put(pad([45, 50, 52, 57], 42.6, 45.0, amp=0.10, a=0.3, r=0.5, bright=3), 42.6)
for j, m in enumerate([38, 45, 50, 54, 57, 64]):
    put(pluck(m, amp=0.11, dec=3.5, bright=1.1), 45.0 + j * 0.035, pan=(j - 2.5) / 5)
put(bell(86, amp=0.05, dec=3.0), 45.2)
put(pad([38, 45, 50, 54, 57, 64], 45.0, 48.6, amp=0.09, a=0.4, r=1.4, bright=4), 45.0)

# ---------- Mezcla: reverb, fades, normalización ----------
def ir(seed, secs=2.6):
    g = np.random.default_rng(seed)
    t = np.arange(int(secs * SR)) / SR
    x = g.standard_normal(len(t)) * np.exp(-t * 2.4)
    sos = butter(1, 5000, fs=SR, output='sos')
    return sosfilt(sos, x) / np.sqrt(np.sum(x ** 2))

wetL = fftconvolve(L, ir(1))[:N]; wetR = fftconvolve(R, ir(2))[:N]
outL = L * 0.8 + wetL * 0.55; outR = R * 0.8 + wetR * 0.55
fade = np.ones(N)
fi = int(0.8 * SR); fade[:fi] = np.linspace(0, 1, fi)
fo0 = int(47.6 * SR); fade[fo0:] = np.linspace(1, 0, N - fo0) ** 1.5
out = np.stack([outL * fade, outR * fade], axis=1)
out *= 0.89 / np.max(np.abs(out))
wavfile.write('musica-la-semilla.wav', SR, (out * 32767).astype(np.int16))
print('ok', out.shape, round(float(np.sqrt(np.mean(out ** 2))), 4))
