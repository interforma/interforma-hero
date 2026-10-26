"""Music and sound effects for Cap. 04 (25 s), original and synthesized.
Playful groove in D major at 112 bpm, with effects synced to the animation."""
import numpy as np
from scipy.signal import fftconvolve, butter, sosfilt
from scipy.io import wavfile

SR = 48000; DUR = 23.0; N = int(SR * DUR)
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
"""Cap. 05 · El mito: arranca tenso (latido y zumbido en menor) y se vuelve una bossa
suave cuando Punto toma las tareas repetitivas. Re menor → Fa mayor, 112 bpm."""
BEAT = 60/112
def heart(t0, a=.16):
    for dt, aa in ((0, 1), (.18, .7)):
        t = np.arange(int(.22*SR))/SR; f = 70*np.exp(-t*6) + 38
        put(a*aa*np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*12), t0+dt)
def shaker(t0, a=.02):
    n = int(.06*SR); x = sosfilt(butter(2, 6000, btype='high', fs=SR, output='sos'), rng.standard_normal(n)); put(a*x/np.max(np.abs(x))*np.sin(np.pi*np.arange(n)/n), t0, pan=.3)
def nylon(m, t0, a=.06): put(pluck(m, a, .55, .9), t0, pan=-.15)
def sigh(t0, a=.05):
    n = int(.5*SR); x = sosfilt(butter(2, [400, 1800], btype='band', fs=SR, output='sos'), rng.standard_normal(n)); put(a*x/np.max(np.abs(x))*np.linspace(1, 0, n)**2, t0)
# A · tenso (0–3.6)
t = np.arange(int(3.7*SR))/SR
put(.045*sum(np.sin(2*np.pi*hz(38+d)*k*t)/k**1.4 for d in (0, .1, 7) for k in (1, 2, 3))/5*np.minimum(1, t/.6)*np.minimum(1, (3.7-t)/.2), 0)
for k in range(5): heart(.3 + k*.72, .14 + .02*k)
for tt, m in [(1.2, 62), (1.8, 61), (2.4, 60)]: put(marimba(m, .08, .5), tt)     # las dudas
swoosh(3.45, .6, .12); glide(3.5, 250, 900, .5, .06)
# B–C · bossa en la oficina (4.0–15.6)
CH = [[53, 57, 60, 64], [50, 53, 57, 60], [46, 50, 53, 57], [48, 52, 55, 58]]   # Fmaj7 Dm7 Bbmaj7 C7
pat = [0, 1.5, 2.5, 3.5]
t = 4.0; bar = 0
while t < 15.5:
    ch = CH[bar % 4]
    put(pluck(ch[0]-12, .14, .6, .6), t); put(pluck(ch[0]-5, .1, .5, .6), t + 2*BEAT)
    for p in pat:
        for j, m in enumerate(ch[1:]): nylon(m+12, t + p*BEAT + j*.01, .045)
    for k in range(8): shaker(t + k*BEAT/2, .02 if k % 2 else .03)
    pad(ch, t, t + 4*BEAT, amp=.025, a=.3, r=.3, bright=2)
    t += 4*BEAT; bar += 1
for i, tt in enumerate([5.0, 6.2, 7.4]):
    swoosh(tt, .5, .08); put(marimba(72 + 4*i, .13, .3), tt + .7); put(bell(84 + 4*i, .04, .6), tt + .72); sigh(tt + .5)
for i, tt in enumerate([11.0, 11.5, 12.0]): glide(tt, 300, 520, .1, .07); put(marimba(77 + 3*i, .12, .3), tt)
for j, m in enumerate([77, 81, 84, 89]): put(bell(m, .05, .9), 14.2 + j*.05)
swoosh(15.35, .5, .12)
# D–E · la pregunta útil y cierre (15.8–23)
pad([50, 57, 62, 65], 15.9, 19.5, amp=.05, a=.6, r=.4)
n = int(.35*SR); x = sosfilt(butter(2, [700, 3000], btype='band', fs=SR, output='sos'), rng.standard_normal(n)); put(.05*x/np.max(np.abs(x))*np.linspace(1, 0, n), 16.7)   # tachado
pad([53, 60, 64, 69], 17.2, 19.5, amp=.05, a=.3, r=.4)
for j, m in enumerate([65, 69, 72, 77]): put(pluck(m, .07, 1.2), 17.2 + j*.08)
pad([41, 53, 57, 60, 64, 69], 19.7, 22.2, amp=.07, a=.1, r=.8, bright=4)
for j, m in enumerate([77, 81, 84, 89, 93]): put(bell(m, .05, 1.0), 19.7 + j*.05, pan=(j-2)/3)
for k in range(3): thump(19.7 + k*1.1, .1)
def ir(seed, secs=1.5):
    g = np.random.default_rng(seed); t = np.arange(int(secs*SR))/SR
    x = g.standard_normal(len(t))*np.exp(-t*3.6); x = sosfilt(butter(1, 5800, fs=SR, output='sos'), x); return x/np.sqrt(np.sum(x**2))
oL = L*.86 + fftconvolve(L, ir(8))[:N]*.32; oR = R*.86 + fftconvolve(R, ir(9))[:N]*.32
fade = np.ones(N); fo = int(22.2*SR); fade[fo:] = np.linspace(1, 0, N-fo)**1.5
out = np.stack([oL*fade, oR*fade], 1); out *= .89/np.max(np.abs(out))
wavfile.write('audio_reel05.wav', SR, (out*32767).astype(np.int16)); print('ok')
