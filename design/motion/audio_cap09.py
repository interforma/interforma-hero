"""Cap. 09 · ¿Qué es un CRM? (32 s). Vals folk en Sol mayor a 138 bpm (3/4): guitarra pulsada,
contrabajo y glockenspiel. Lápiz, taza que cae, hojas al viento, pops de la ficha y campanita del aviso."""
import numpy as np
from scipy.signal import fftconvolve, butter, sosfilt
from scipy.io import wavfile

SR = 48000; DUR = 32.0; N = int(SR * DUR)
L = np.zeros(N); R = np.zeros(N); rng = np.random.default_rng(11)
hz = lambda m: 440.0 * 2 ** ((m - 69) / 12)

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
    s = sum(a*np.sin(2*np.pi*f*r*t)*np.exp(-t/(dec*d)) for r, a, d in [(1,1,1),(2.76,.4,.5),(5.4,.2,.3)])
    return amp * s

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

def glide(t0, f0, f1, d, amp=.1, shape=np.sin):
    t = np.arange(int(d*SR)) / SR; f = np.linspace(f0, f1, len(t))
    put(amp * shape(2*np.pi*np.cumsum(f)/SR) * np.sin(np.pi*t/d), t0)

def swoosh(t0, d=.45, amp=.12):
    n = int(d*SR); x = rng.standard_normal(n)
    sos = butter(2, [600, 5000], btype='band', fs=SR, output='sos'); x = sosfilt(sos, x)
    e = np.sin(np.pi*np.linspace(0, 1, n))**2; put(amp * x * e / np.max(np.abs(x)), t0)

def click(t0, amp=.05, f=2400):
    t = np.arange(int(.03*SR)) / SR; put(amp*np.sin(2*np.pi*f*t)*np.exp(-t*180), t0)

def buzz(t0):
    for k in range(3):
        t = np.arange(int(.14*SR)) / SR
        s = np.sign(np.sin(2*np.pi*170*t)) * .5 + np.sin(2*np.pi*340*t) * .5
        sos = butter(2, 900, fs=SR, output='sos')
        put(.07 * sosfilt(sos, s) * np.sin(np.pi*t/.14), t0 + k*.19)

def thump(t0, amp=.25):
    t = np.arange(int(.4*SR)) / SR; f = 110*np.exp(-t*10) + 48
    put(amp*np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*9), t0)
BEAT = 60/138
def pencil(t0, d, a=.02):
    n = int(d*SR); x = sosfilt(butter(2, [3000, 9000], btype='band', fs=SR, output='sos'), rng.standard_normal(n))
    m = (np.sin(2*np.pi*7*np.arange(n)/SR) > -.2).astype(float)
    put(a*x/np.max(np.abs(x))*m*np.minimum(1, np.arange(n)/400), t0, .35)
def clink(t0, a=.08):
    for f, d in [(2900, .5), (4100, .3), (6200, .2)]:
        t = np.arange(int(d*SR))/SR; put(a*np.sin(2*np.pi*f*t)*np.exp(-t*12), t0, .2)
def splash(t0, a=.1):
    n = int(.7*SR); x = sosfilt(butter(2, [300, 2500], btype='band', fs=SR, output='sos'), rng.standard_normal(n))
    put(a*x/np.max(np.abs(x))*np.exp(-np.linspace(0, 6, n)), t0, .2)
def pop(t0, a=.09): glide(t0, 500, 1300, .09, a)
def glock(m, t0, a=.05): put(bell(m, a, .9), t0, .25)
# 0–5: vals tranquilo (lápiz anotando)
def waltz(t_start, t_end, prog_, amp=1.0):
    t = t_start; bar = 0
    while t < t_end - 1e-6:
        ch = prog_[bar % len(prog_)]
        put(pluck(ch[0]-12, .17*amp, .6, .6), t)                                # bajo en el 1
        for b in (1, 2):
            x = t + b*BEAT
            if x >= t_end: break
            for j, m in enumerate(ch): put(pluck(m+12, .045*amp, .35, 1.4), x + j*.012, pan=-.25)
        t += 3*BEAT; bar += 1
G = [[55, 59, 62], [50, 54, 57], [52, 55, 59], [48, 52, 55]]       # G D Em C
Gb = [[55, 59, 62], [48, 52, 55], [50, 54, 57], [55, 59, 62]]      # G C D G
waltz(0.0, 4.9, G, .8)
for t0, d in [(.7, .6), (1.5, .7), (2.3, .6), (3.1, .7), (3.8, .6)]: pencil(t0, d)
pencil(2.6, .4, .03)                                                   # tacha la deuda
# 4.9–10: el accidente
clink(4.95); splash(5.25); thump(5.3, .12)
pad([52, 55, 59], 5.2, 9.8, amp=.04, a=.4, r=.4)
for i in range(3): swoosh(6.6 + i*.35, .9, .07)
pop(5.9, .1); put(bell(91, .05, .6), 6.0)
for k in range(3): click(8.2 + k*.25, .03, 1300)                      # Punto piensa
for m, t0 in [(64, 5.6), (62, 6.9), (60, 8.2)]: put(pluck(m, .06, 1.2), t0, -.2)
# 10–26.6: el vals se arma con la ficha
glide(10.0, 300, 1100, .25, .08)
waltz(10.2, 26.6, Gb, 1.0)
mel = [(79, 10.6), (81, 11.9), (83, 12.6), (81, 13.9), (79, 15.2), (78, 16.5), (79, 17.8), (81, 19.1),
       (83, 21.0), (86, 21.6), (83, 22.3), (81, 23.0), (79, 23.9), (83, 24.5), (86, 25.1), (91, 25.8)]
for m, t0 in mel: glock(m, t0, .045)
pop(10.6, .08)
for a in (11.6, 15.9, 17.5, 19.8): pop(a, .08); put(marimba(84, .08, .25), a+.5)
for j, m in enumerate([88, 91, 88, 91, 88]): put(bell(m, .05, .4), 20.4 + j*.12, pan=.4)   # campanita
for j in range(3): pop(23.9 + j*.22, .07)
swoosh(26.6, .5, .12)
# cierre en Umbra (27–32)
pad([43, 55, 59, 62], 27.1, 29.4, amp=.06, a=.4, r=.4)
pad([48, 55, 60, 64], 28.3, 30.6, amp=.06, a=.4, r=.6)
for m, t0 in [(79, 27.3), (83, 27.9), (86, 28.4), (84, 28.9), (83, 29.4)]: glock(m, t0, .04)
for j, m in enumerate([67, 71, 74, 79, 83]): put(bell(m, .05, 1.0), 29.2 + j*.05, pan=(j-2)/3)
for j, m in enumerate([43, 50, 55, 59, 62, 67]): put(pluck(m, .05, 2.0), 30.2 + j*.04)
def ir(seed, secs=1.4):
    g = np.random.default_rng(seed); t = np.arange(int(secs*SR))/SR
    x = g.standard_normal(len(t))*np.exp(-t*4); x = sosfilt(butter(1, 6000, fs=SR, output='sos'), x); return x/np.sqrt(np.sum(x**2))
oL = L*.88 + fftconvolve(L, ir(12))[:N]*.28; oR = R*.88 + fftconvolve(R, ir(13))[:N]*.28
fade = np.ones(N); fo = int(31.0*SR); fade[fo:] = np.linspace(1, 0, N-fo)**1.5
out = np.stack([oL*fade, oR*fade], 1); out *= .89/np.max(np.abs(out))
wavfile.write('audio_cap09.wav', SR, (out*32767).astype(np.int16)); print('ok')
