"""Music and sound effects for Cap. 04 (25 s), original and synthesized.
Playful groove in D major at 112 bpm, with effects synced to the animation."""
import numpy as np
from scipy.signal import fftconvolve, butter, sosfilt
from scipy.io import wavfile

SR = 48000; DUR = 25.0; N = int(SR * DUR)
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

# 1 · Lullaby (0–2.75): music box, Punto sleeping
pad([50, 57, 62], 0, 2.8, amp=.05, a=.8, r=.4, bright=2)
for i, m in enumerate([74, 78, 81, 78, 74, 78]):
    put(bell(m, .05, .9), .25 + i*.42, pan=.3*(-1)**i)
buzz(2.6)
glide(2.75, 420, 1100, .18, .12)                 # wakes up
put(bell(93, .07, .8), 2.78); put(bell(98, .05, .8), 2.85)

# Groove (3.0–20.0): bass + marimba in D major
prog_ = [(50, 54, 57), (47, 50, 54), (43, 47, 50), (45, 49, 52)]   # D Bm G A
t = 3.0; bar = 0
while t < 20.0 - 1e-6:
    ch = prog_[bar % 4]
    pad(list(ch), t, t + 4*BEAT, amp=.035, a=.15, r=.3)
    for b in range(4):
        tb = t + b*BEAT
        if tb >= 20.0: break
        put(pluck(ch[0]-12, .16, .45, .6), tb)                        # bass
        put(marimba(ch[(b*2) % 3]+24, .07), tb + BEAT/2, pan=.35)      # off-beat
        if b % 2 == 0: click(tb, .025, 3000)                           # light tick
    t += 4*BEAT; bar += 1

# Scene effects
swoosh(7.85)
for k in range(30):                              # typing
    click(9.1 + k*.034, .03, 1800 + 300*(k % 3))
for tc, m in [(13.2, 81), (13.7, 83), (14.2, 86)]:   # checks
    put(marimba(m, .14, .3), tc); click(tc, .05)
glide(14.6, 600, 950, .14, .09); put(bell(90, .05, .7), 14.6)
glide(14.8, 300, 520, .1, .07)                   # message pops up
glide(16.3, 300, 520, .1, .07)
put(marimba(71, .14, .4), 16.8); put(marimba(66, .14, .5), 17.05)   # uh-oh
swoosh(17.45, .5, .09)
swoosh(18.15, .35, .07)
for j, m in enumerate([74, 78, 81, 86]): put(marimba(m, .1, .35), 18.9 + j*.06)
swoosh(19.95, .5, .12)

# Outro (20.4–25)
pad([50, 54, 57, 62], 20.4, 22.2, amp=.06, a=.3, r=.3)
put(pluck(50, .14, 1.0), 20.6); put(pluck(54, .1, 1.0), 20.65)
put(pluck(45, .14, 1.0), 21.6); put(pluck(52, .1, 1.0), 21.65)
pad([38, 50, 54, 57, 62, 66], 22.2, 24.2, amp=.08, a=.15, r=.8, bright=4)
for j, m in enumerate([74, 78, 81, 86, 90]): put(bell(m, .05, 1.0), 22.2 + j*.05, pan=(j-2)/3)
for k in range(3): thump(22.2 + k*1.1, .12)
for j, m in enumerate([50, 57, 62, 66, 69, 74]): put(pluck(m, .09, 2.0), 23.3 + j*.03)

def ir(seed, secs=1.6):
    g = np.random.default_rng(seed); t = np.arange(int(secs*SR))/SR
    x = g.standard_normal(len(t))*np.exp(-t*3.5); x = sosfilt(butter(1, 6000, fs=SR, output='sos'), x)
    return x/np.sqrt(np.sum(x**2))
oL = L*.85 + fftconvolve(L, ir(3))[:N]*.35; oR = R*.85 + fftconvolve(R, ir(4))[:N]*.35
fade = np.ones(N); fo = int(24.2*SR); fade[fo:] = np.linspace(1, 0, N-fo)**1.5
out = np.stack([oL*fade, oR*fade], 1); out *= .89/np.max(np.abs(out))
wavfile.write('audio_cap04.wav', SR, (out*32767).astype(np.int16)); print('ok')
