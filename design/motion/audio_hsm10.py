"""Music and sound effects for Cap. 04 (25 s), original and synthesized.
Playful groove in D major at 112 bpm, with effects synced to the animation."""
import numpy as np
from scipy.signal import fftconvolve, butter, sosfilt
from scipy.io import wavfile

SR = 48000; DUR = 44.0; N = int(SR * DUR)
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
"""Cap. 10 · ¿Cómo se envía un HSM? Electrónica técnica y luminosa a 110 bpm: pulso de
sintetizador en semicorcheas, bombo suave y pads; plumón y borrador como efectos.
Cada paso cambia el acorde (Mi menor → Do → Sol → Re) y el último sube a Mi mayor."""
BEAT = 60/110
def saw(m, t0, d, a=.03, cut=1800, pan=0):
    t = np.arange(int(d*SR))/SR; f = hz(m)
    s = sum(np.sin(2*np.pi*f*k*t)/k for k in range(1, 12)); s = sosfilt(butter(2, cut, fs=SR, output='sos'), s)
    put(a*s*np.minimum(1, t/.01)*np.exp(-t*4), t0, pan)
def kick(t0, a=.22):
    t = np.arange(int(.3*SR))/SR; f = 48 + 90*np.exp(-t*30); put(a*np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*10), t0)
def hat(t0, a=.018):
    n = int(.05*SR); x = sosfilt(butter(2, 8000, btype='high', fs=SR, output='sos'), rng.standard_normal(n)); put(a*x/np.max(np.abs(x))*np.exp(-np.arange(n)/SR*60), t0, .3)
def marker(t0, d=.5, a=.025):
    n = int(d*SR); x = sosfilt(butter(2, [2500, 6000], btype='band', fs=SR, output='sos'), rng.standard_normal(n))
    env = (np.sin(2*np.pi*7*np.arange(n)/SR) > 0)*np.sin(np.pi*np.arange(n)/n); put(a*x/np.max(np.abs(x))*env, t0, -.2)
def eraser(t0, d=.45, a=.05):
    n = int(d*SR); x = sosfilt(butter(2, [400, 2500], btype='band', fs=SR, output='sos'), rng.standard_normal(n)); put(a*x/np.max(np.abs(x))*np.abs(np.sin(2*np.pi*6*np.arange(n)/SR)), t0)
def stamp(t0): thump(t0, .25); click(t0, .08, 900)
HS_T = [4.6, 10.4, 16.4, 22.2, 28.6, 34.6, 39.6]
STEP_CH = [[52, 55, 59], [48, 52, 55], [55, 59, 62], [50, 54, 57], [48, 52, 55], [52, 56, 59]]
# portada (0–4.6): pad y pulso tímido
pad([40, 52, 55, 59], 0, 4.6, amp=.045, a=1.0, r=.3)
for k in range(16): saw([64, 67, 71, 74][k % 4], .5 + k*BEAT/2, .2, .016, 1200, .3)
glide(1.6, 400, 900, .2, .06); marker(1.7, 1.2)
# pasos (4.6–39.6)
for i in range(6):
    t0, t1 = HS_T[i], HS_T[i+1]; ch = STEP_CH[i]
    pad(ch, t0, t1, amp=.03, a=.3, r=.3, bright=2)
    t = t0; k = 0
    while t < t1 - .05:
        saw(ch[k % 3] + 24 + (12 if k % 8 == 7 else 0), t, .18, .02, 2200, .25*np.sin(k))
        if k % 4 == 0: kick(t)
        if k % 2 == 1: hat(t)
        if k % 8 == 0: put(pluck(ch[0]-12, .12, .4, .6), t)
        t += BEAT/2; k += 1
    marker(t0 + .1, .9); eraser(t1 - .55)
# efectos por paso
for k, tc in enumerate([1.5, 2.0, 2.5]): put(marimba(76 + 2*k, .1, .3), HS_T[0] + tc)
glide(HS_T[0] + 2.9, 600, 300, .25, .05)                                  # Pedro no aceptó
for k in range(2): swoosh(HS_T[0] + 2.4 + k*.5, .4, .05)
for k in range(10): click(HS_T[1] + 2.0 + k*.2, .025, 1500)               # Meta revisa
stamp(HS_T[1] + 3.9); [put(bell(m, .05, .8), HS_T[1] + 3.95 + j*.05) for j, m in enumerate([79, 83, 86])]
for k in range(3): swoosh(HS_T[2] + 1.8 + k*.9, .35, .05); put(marimba(74 + 3*k, .1, .3), HS_T[2] + 2.15 + k*.9)
for tc in [2.2, 2.4, 2.6]: click(HS_T[3] + tc, .05, 2800)                  # enviado
for tc in [2.9, 3.1]: click(HS_T[3] + tc, .05, 3200); click(HS_T[3] + tc + .06, .05, 3200)   # entregado
for tc in [3.6, 4.6]: put(bell(88, .05, .6), HS_T[3] + tc)                 # leído
put(marimba(62, .12, .4), HS_T[3] + 3.2); put(marimba(58, .12, .5), HS_T[3] + 3.45)          # fallido
click(HS_T[4] + 1.2, .07, 2600); glide(HS_T[4] + 1.7, 400, 700, .1, .06)
for k in range(24): click(HS_T[4] + 2.2 + k*.135, .02, 1900)              # reloj de 24 h
glide(HS_T[4] + 5.4, 700, 350, .3, .05)
for k in range(4): put(marimba(79 + 2*k, .1, .3), HS_T[5] + .4 + k*.25)
for j, m in enumerate([76, 80, 83, 88]): put(bell(m, .05, .9), HS_T[5] + 1.8 + j*.05)
swoosh(39.2, .5, .12)
# cierre (39.6–44)
pad([40, 52, 56, 59, 64], 39.8, 42.6, amp=.07, a=.2, r=.8, bright=4)
for j, m in enumerate([64, 68, 71, 76, 80]): put(bell(m, .05, 1.0), 41.4 + j*.05, pan=(j-2)/3)
for j, m in enumerate([52, 59, 64, 68, 71, 76]): put(pluck(m, .05, 2.0), 42.0 + j*.04)
def ir(seed, secs=1.4):
    g = np.random.default_rng(seed); t = np.arange(int(secs*SR))/SR
    x = g.standard_normal(len(t))*np.exp(-t*4); x = sosfilt(butter(1, 6500, fs=SR, output='sos'), x); return x/np.sqrt(np.sum(x**2))
oL = L*.87 + fftconvolve(L, ir(31))[:N]*.3; oR = R*.87 + fftconvolve(R, ir(32))[:N]*.3
fade = np.ones(N); fo = int(43.2*SR); fade[fo:] = np.linspace(1, 0, N-fo)**1.5
out = np.stack([oL*fade, oR*fade], 1); out *= .89/np.max(np.abs(out))
wavfile.write('audio_hsm10.wav', SR, (out*32767).astype(np.int16)); print('ok')
