"""Music and sound effects for Cap. 04 (25 s), original and synthesized.
Playful groove in D major at 112 bpm, with effects synced to the animation."""
import numpy as np
from scipy.signal import fftconvolve, butter, sosfilt
from scipy.io import wavfile

SR = 48000; DUR = 34.5; N = int(SR * DUR)
L = np.zeros(N); R = np.zeros(N); rng = np.random.default_rng(11)
hz = lambda m: 440.0 * 2 ** ((m - 69) / 12)
BEAT = 60 / 112

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
import sys
KIND = sys.argv[1]   # clinica | automotora
pop = lambda t0, a=.07: glide(t0, 300, 520, .1, a)

# Hook (0–5.5)
pad([50, 57, 62], 0, 2.1, amp=.05, a=.6, r=.4, bright=2)
for i, m in enumerate([74, 78, 81, 78]):
    put(bell(m, .05, .9), .2 + i*.42, pan=.3*(-1)**i)
buzz(1.8)
for i in range(3 if KIND == 'clinica' else 1): pop(1.8 + i*.3, .06)
if KIND == 'clinica':
    for k in range(12): click(1.9 + k*.11, .025, 2600 + 120*(k % 4))   # contador del badge
glide(2.0, 420, 1100, .18, .12); put(bell(93, .07, .8), 2.03); put(bell(98, .05, .8), 2.1)

# Groove (2.2–28.0) en Re mayor; en la parte 2 sube a Sol para dar impulso
P1 = [(50, 54, 57), (47, 50, 54), (43, 47, 50), (45, 49, 52)]
P2 = [(43, 47, 50), (45, 49, 52), (47, 50, 54), (50, 54, 57)]
t = 2.2; bar = 0
while t < 28.0 - 1e-6:
    ch = (P1 if t < 15.6 else P2)[bar % 4]
    pad(list(ch), t, t + 4*BEAT, amp=.033, a=.15, r=.3)
    for b in range(4):
        tb = t + b*BEAT
        if tb >= 28.0: break
        put(pluck(ch[0]-12, .16, .45, .6), tb)
        put(marimba(ch[(b*2) % 3]+24, .065), tb + BEAT/2, pan=.35)
        if b % 2 == 0: click(tb, .025, 3000)
    t += 4*BEAT; bar += 1

swoosh(5.45)
# Parte 1 (t0 = 5.9)
T = 5.9
for k in range(28): click(T + .5 + k*.035, .03, 1800 + 300*(k % 3))      # escribe
for j in range(3): click(T + 1.6 + j*.15, .03, 1400)                     # piensa
pop(T + 2.2)
if KIND == 'clinica':
    for j, m in enumerate([79, 81, 83]): put(marimba(m, .12, .3), T + 2.6 + j*.2); 
    click(T + 3.95, .06); put(marimba(86, .14, .35), T + 4.0)
    swoosh(T + 4.35, .4, .08)
    glide(T + 4.9, 500, 900, .45, .05)
    put(marimba(86, .14, .3), T + 5.4); put(bell(90, .05, .7), T + 5.42)
    pop(T + 5.9)
else:
    swoosh(T + 2.75, .4, .08)
    for j, (tc, m) in enumerate([(3.3, 81), (4.0, 83), (4.7, 86)]):
        put(marimba(m, .14, .3), T + tc); click(T + tc, .05)
    glide(T + 5.0, 300, 900, .8, .05)
    for j, m in enumerate([86, 90, 93]): put(bell(m, .05, .7), T + 5.8 + j*.05)
    pop(T + 6.0)
    swoosh(T + 6.55, .45, .09); swoosh(T + 7.15, .35, .07)
    for j, m in enumerate([74, 78, 81, 86]): put(marimba(m, .1, .35), T + 7.8 + j*.06)

# Parte 2 · flujo HSM (t0 = 15.6)
T = 15.6
glide(T, 500, 700, .12, .05)
for j in range(4): click(T + .6 + j*.2, .04, 2200)
swoosh(T + 1.5, .35, .06)
pop(T + 1.9)
for j, m in enumerate([86, 90, 93, 98]): put(bell(m, .045, .6), T + 3.0 + j*.07, pan=(j-1.5)/2)   # personaliza
glide(T + 3.6, 500, 260, .4, .05)                                                                 # se agacha
thump(T + 4.0, .2); glide(T + 4.0, 300, 1200, .35, .09)                                          # ¡lanza!
for i in range(4): swoosh(T + 4.3 + i*.15, .25, .05); click(T + 4.9 + i*.15, .05, 2800)
yes = [0, 1, 3] if KIND == 'clinica' else [0, 2, 3]
for i in range(4): put(marimba(83 if i in yes else 74, .13, .3), T + 6.0 + i*.25)
for k in range(16): click(T + 7.0 + 1.6*(k/16)**.7, .035, 2000 + 90*k)                          # contadores
for j, m in enumerate([74, 78, 81, 86, 90]): put(bell(m, .05, .9), T + 8.6 + j*.05, pan=(j-2)/3)
swoosh(27.95, .5, .12)

# Cierre (28.4–34.5)
pad([50, 54, 57, 62], 28.4, 30.2, amp=.06, a=.3, r=.3)
put(pluck(50, .14, 1.0), 28.6); put(pluck(54, .1, 1.0), 28.65)
put(pluck(45, .14, 1.0), 29.5); put(pluck(52, .1, 1.0), 29.55)
pad([38, 50, 54, 57, 62, 66], 30.2, 32.6, amp=.08, a=.15, r=.9, bright=4)
for j, m in enumerate([74, 78, 81, 86, 90]): put(bell(m, .05, 1.0), 30.2 + j*.05, pan=(j-2)/3)
for k in range(3): thump(30.2 + k*1.1, .12)
for j, m in enumerate([50, 57, 62, 66, 69, 74]): put(pluck(m, .09, 2.0), 31.0 + j*.03)

def ir(seed, secs=1.6):
    g = np.random.default_rng(seed); t = np.arange(int(secs*SR))/SR
    x = g.standard_normal(len(t))*np.exp(-t*3.5); x = sosfilt(butter(1, 6000, fs=SR, output='sos'), x)
    return x/np.sqrt(np.sum(x**2))
oL = L*.85 + fftconvolve(L, ir(3))[:N]*.35; oR = R*.85 + fftconvolve(R, ir(4))[:N]*.35
fade = np.ones(N); fo = int(33.2*SR); fade[fo:] = np.linspace(1, 0, N-fo)**1.5
out = np.stack([oL*fade, oR*fade], 1); out *= .89/np.max(np.abs(out))
wavfile.write(f'audio_{KIND}.wav', SR, (out*32767).astype(np.int16)); print('ok', KIND)
