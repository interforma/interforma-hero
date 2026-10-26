"""Music and sound effects for Cap. 04 (25 s), original and synthesized.
Playful groove in D major at 112 bpm, with effects synced to the animation."""
import numpy as np
from scipy.signal import fftconvolve, butter, sosfilt
from scipy.io import wavfile

SR = 48000; DUR = 28.0; N = int(SR * DUR)
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
"""El barrio de Punto · Ep. 01 (Doña Rosa): parte con un acordeón cansado de noche,
cada audio suena como una notificación, y cuando llega Punto entra una cumbia suave
(La menor → Do mayor cuando aparece la solución). 100 bpm."""
BEAT = 60/100
def accordion(m, t0, d, a=.045, pan=.15):
    t = np.arange(int(d*SR))/SR; f = hz(m)*(1+.004*np.sin(2*np.pi*5.2*t))
    s = sum(np.sign(np.sin(2*np.pi*np.cumsum(f*k)/SR))/k**1.6 for k in (1, 2, 3))
    s = sosfilt(butter(2, 2600, fs=SR, output='sos'), s)
    put(a*s*np.minimum(1, t/.05)*np.minimum(1, (d-t)/.08), t0, pan)
def guiro(t0, a=.03):
    n = int(.16*SR); x = sosfilt(butter(2, [2500, 7000], btype='band', fs=SR, output='sos'), rng.standard_normal(n))
    put(a*x/np.max(np.abs(x))*(np.sin(2*np.pi*55*np.arange(n)/SR) > 0)*np.linspace(1, .3, n), t0, -.3)
def blip(t0, a=.05): glide(t0, 880, 1320, .07, a); glide(t0+.08, 1320, 1320, .05, a*.7)
# noche cansada (0–4.6)
for m, t0, d in [(69, .2, .9), (67, 1.1, .5), (65, 1.6, .5), (64, 2.1, 1.0), (62, 3.2, .5), (64, 3.7, .8)]: accordion(m, t0, d, .035)
pad([45, 52, 57, 60], 0, 4.6, amp=.04, a=.6, r=.3)
R_ = np.random.default_rng(2026); ts = [.9 + i*.22 for i in range(14)]
for t0 in ts: blip(t0, .035)
for k in range(9): click(.3 + k*.5, .03, 1600)                   # reloj
# Punto llega
glide(4.6, 300, 1100, .25, .09); put(bell(88, .06, .8), 4.65)
# cumbia (4.8–21.1)
CH = {0: [[57, 60, 64], [52, 56, 59], [53, 57, 60], [52, 56, 59]],      # Am E F E
      1: [[48, 52, 55], [53, 57, 60], [55, 59, 62], [48, 52, 55]]}      # C F G C
t = 4.8; bar = 0
while t < 21.0:
    prog_ = CH[1] if t >= 12.0 else CH[0]; ch = prog_[bar % 4]
    for b in range(4):
        x = t + b*BEAT
        if x >= 21.0: break
        put(pluck(ch[0]-12, .15, .4, .6), x if b % 2 == 0 else x + BEAT*.5)   # bajo cumbiero
        for j, m in enumerate(ch): put(pluck(m+12, .028, .16, 1.6), x + BEAT/2 + j*.008, pan=.3)  # órgano a contratiempo
        guiro(x, .025); guiro(x + BEAT/2, .018)
        click(x, .02, 2600)
    t += 4*BEAT; bar += 1
mel = [(76, 5.0, .3), (77, 5.3, .3), (76, 5.6, .6), (72, 6.3, .3), (74, 6.6, .3), (76, 6.9, .9),
       (72, 12.2, .3), (74, 12.5, .3), (76, 12.8, .6), (79, 13.5, .3), (77, 13.8, .3), (76, 14.1, .9),
       (79, 16.6, .3), (81, 16.9, .3), (79, 17.2, .6), (76, 17.9, .3), (77, 18.2, .3), (79, 18.5, 1.2)]
for m, t0, d in mel: accordion(m, t0, d, .04)
for k in range(3): swoosh(5.4 + k*.15, .45, .06)                 # audios a las barras
glide(6.0, 300, 900, 1.0, .04)
for j, m in enumerate([81, 84, 88]): put(bell(m, .05, .8), 8.8 + j*.06)   # 8 de cada 10
for k in range(3): click(9.2 + k*.2, .03, 1300)                 # Punto piensa
blip(12.5, .04); click(14.0, .07, 2600); put(marimba(84, .12, .3), 14.05)
for j, m in enumerate([84, 88, 91, 96]): put(bell(m, .045, .7), 14.5 + j*.05)
put(marimba(88, .12, .3), 15.0)
for j, m in enumerate([72, 76, 79, 84]): put(bell(m, .05, 1.0), 16.6 + j*.05)   # amanece / cierra a las 19
swoosh(21.05, .5, .12)
# cierre (21.5–28)
pad([48, 55, 60, 64], 21.6, 24.0, amp=.06, a=.4, r=.4)
accordion(72, 21.8, .6, .035); accordion(76, 22.5, .6, .035)
pad([41, 53, 57, 60, 65], 22.8, 25.0, amp=.06, a=.3, r=.6)
accordion(77, 23.0, .5, .035); accordion(79, 23.6, 1.0, .04)
for j, m in enumerate([72, 76, 79, 84, 88]): put(bell(m, .05, 1.0), 23.6 + j*.05, pan=(j-2)/3)
for j, m in enumerate([48, 55, 60, 64, 67, 72]): put(pluck(m, .05, 2.0), 25.2 + j*.04)
def ir(seed, secs=1.4):
    g = np.random.default_rng(seed); t = np.arange(int(secs*SR))/SR
    x = g.standard_normal(len(t))*np.exp(-t*4); x = sosfilt(butter(1, 6000, fs=SR, output='sos'), x); return x/np.sqrt(np.sum(x**2))
oL = L*.88 + fftconvolve(L, ir(12))[:N]*.28; oR = R*.88 + fftconvolve(R, ir(13))[:N]*.28
fade = np.ones(N); fo = int(27.0*SR); fade[fo:] = np.linspace(1, 0, N-fo)**1.5
out = np.stack([oL*fade, oR*fade], 1); out *= .89/np.max(np.abs(out))
wavfile.write('audio_rosa01.wav', SR, (out*32767).astype(np.int16)); print('ok')
