"""Música y efectos · Cap. 08, las reglas de la casa (38,6 s), original y sintetizada.
Dembow-pop a 96 bpm en D menor: bajo, plucks en contratiempo, marimba; llaves, sello y candado como efectos."""
import numpy as np
from scipy.signal import fftconvolve, butter, sosfilt
from scipy.io import wavfile

SR = 48000; DUR = 38.6; N = int(SR * DUR)
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

from scipy.signal import sawtooth
ML = np.zeros(N); MR = np.zeros(N)   # bus musical (se le aplica sidechain)
def putm(sig, t0, pan=0.0):
    i = int(t0 * SR)
    if i >= N or i < 0: return
    sig = sig[: N - i]
    ML[i:i+len(sig)] += sig * np.cos((pan + 1) * np.pi / 4)
    MR[i:i+len(sig)] += sig * np.sin((pan + 1) * np.pi / 4)
KICKS = []
def kick(t0, amp=.5):
    KICKS.append(t0); t = np.arange(int(.42*SR)) / SR; f = 46 + 120*np.exp(-t*28)
    s = np.sin(2*np.pi*np.cumsum(f)/SR) * np.exp(-t*7.5); s[:int(.004*SR)] += rng.standard_normal(int(.004*SR))*.3
    put(amp * s, t0)
def clap(t0, amp=.16, pan=0):
    n = int(.22*SR); x = rng.standard_normal(n); sos = butter(2, [900, 4200], btype='band', fs=SR, output='sos'); x = sosfilt(sos, x)
    t = np.arange(n)/SR; e = np.exp(-t*22)
    for d in (.0, .011, .022): e += np.where(t >= d, np.exp(-(t-d)*90), 0)*.6
    put(amp * x * e / 3, t0, pan)
def hat(t0, amp=.05, open_=False, pan=.2):
    d = .2 if open_ else .045; n = int(d*SR); x = rng.standard_normal(n)
    x = sosfilt(butter(2, 7000, btype='high', fs=SR, output='sos'), x); t = np.arange(n)/SR
    put(amp * x * np.exp(-t*(14 if open_ else 90)), t0, pan)
def shaker(t0, amp=.035, pan=-.3):
    n = int(.07*SR); x = rng.standard_normal(n); x = sosfilt(butter(2, [4000, 11000], btype='band', fs=SR, output='sos'), x)
    t = np.arange(n)/SR; put(amp * x * np.sin(np.pi*t/.07)**2, t0, pan)
def conga(t0, f=210, amp=.16, pan=.4):
    t = np.arange(int(.3*SR))/SR; ff = f*(1+.25*np.exp(-t*40)); put(amp*np.sin(2*np.pi*np.cumsum(ff)/SR)*np.exp(-t*14), t0, pan)
def rim(t0, amp=.08, pan=-.1):
    t = np.arange(int(.05*SR))/SR; s = np.sin(2*np.pi*1700*t)*np.exp(-t*120) + rng.standard_normal(len(t))*np.exp(-t*200)*.4
    put(amp*s, t0, pan)
def sawbass(m, t0, d, amp=.16, cut=520):
    t = np.arange(int(d*SR))/SR; s = sawtooth(2*np.pi*hz(m)*t)*.6 + np.sin(2*np.pi*hz(m)*t)
    s = sosfilt(butter(2, cut, fs=SR, output='sos'), s); e = np.minimum(1, t/.004) * np.exp(-t*3) * np.minimum(1, (d-t)/.02)
    putm(amp * s * e, t0)
def stab(ms, t0, d=.22, amp=.06, cut=2600, pan=0):
    t = np.arange(int(d*SR))/SR; s = sum(sawtooth(2*np.pi*hz(m+dt)*t) for m in ms for dt in (-.06, .06)) / (2*len(ms))
    s = sosfilt(butter(2, cut, fs=SR, output='sos'), s); e = np.minimum(1, t/.003)*np.exp(-t*9)
    putm(amp * s * e, t0, pan)
def brass(ms, t0, d=.35, amp=.07, pan=0):
    t = np.arange(int(d*SR))/SR; s = sum(sawtooth(2*np.pi*hz(m)*t*(1+.003*np.sin(2*np.pi*5*t))) for m in ms)/len(ms)
    br = sosfilt(butter(2, 3200, fs=SR, output='sos'), s); dk = sosfilt(butter(2, 800, fs=SR, output='sos'), s)
    w = np.exp(-t*9); e = np.minimum(1, t/.02)*np.minimum(1, (d-t)/.05)
    putm(amp * (br*w + dk*(1-w)) * e, t0, pan)
def riser(t0, d, amp=.08):
    n = int(d*SR); x = rng.standard_normal(n); t = np.arange(n)/SR; out = np.zeros(n)
    for k in range(0, n, 2400):
        f = 400 + 7000*(k/n)**2; out[k:k+2400] = sosfilt(butter(2, [f, min(f*2.2, 20000)], btype='band', fs=SR, output='sos'), x[k:k+2400])
    put(amp * out * (t/d)**2, t0)
def duck_and_mix(depth=.55, rel=.18):
    g = np.ones(N)
    for k in KICKS:
        i = int(k*SR); n = int(rel*2.5*SR); t = np.arange(n)/SR
        seg = 1 - depth*np.exp(-t/rel*1.0); j = min(N, i+n); g[i:j] = np.minimum(g[i:j], seg[:j-i])
    L[:] += ML*g; R[:] += MR*g
# ---------- Cap. 08 · reglas de la casa: dembow-pop a 96 bpm en D menor ----------
BEAT = 60/96; BAR = 4*BEAT; S16 = BEAT/4
PROG = [(50, 53, 57), (46, 50, 53), (48, 52, 55), (45, 49, 52)]   # Dm Bb C A
T = [5.0, 10.5, 16.0, 21.5, 27.0, 33.0]
# gancho (0–5): pluck + bajo, cajas que caen
t = .0; b = 0
while t < T[0] - 1e-6:
    ch = PROG[(b//4) % 4]
    if b % 2 == 0: putm(pluck(ch[0]-12, .14, .5, .7), t)
    for q in (0, 2, 3): putm(pluck(ch[(b+q) % 3]+24, .045, .15, 1.8), t + q*S16, pan=.3)
    hat(t + BEAT/2, .025)
    t += BEAT; b += 1
for ta in (1.0, 1.5, 2.0, 2.5):
    thump(ta + .45, .22); put(marimba(62 + int((ta-1)*8), .1, .3), ta + .45)
riser(3.6, 1.4, .08)
# groove dembow (5–33)
t = T[0]; b = 0
while t < T[5] - 1e-6:
    bar = b // 4; ch = PROG[bar % 4]
    kick(t, .44)
    if b % 2 == 0:
        for q in (3, 6): clap(t + q*S16, .11)          # el «chick» del dembow (en 2 tiempos)
        rim(t + 7*S16, .05)
    for q in range(4): hat(t + q*S16, .03 if q == 2 else .015, pan=-.2)
    sawbass(ch[0]-24, t, BEAT*.7, .2, 420)
    if b % 2 == 1: sawbass(ch[0]-12, t + 2*S16, S16*.8, .08, 900)
    # gancho: pluck en contratiempos + marimba en compases pares
    for q in (2, 3): putm(pluck(ch[(b*2+q) % 3]+24, .05, .14, 1.8), t + q*S16, pan=.35)
    if bar % 2 == 0 and b % 4 == 0:
        for q, m in [(0, ch[2]+12), (3, ch[0]+24), (6, ch[1]+24), (10, ch[2]+12), (12, ch[0]+24)]: putm(marimba(m, .065, .25), t + q*S16, pan=-.3)
    if b % 4 == 0: stab([m+12 for m in ch], t, .3, .04, 2200, pan=.1)
    if b % 16 == 0: pad(list(ch) + [ch[0]+12], t, t + 4*BAR - .2, amp=.028, a=.3, r=.4)
    t += BEAT; b += 1
for x in T[1:5]: swoosh(x - .35, .45, .1)
# efectos
for j in range(4):
    s0 = T[0] + .5 + j*.9
    for k in range(7): click(s0 + k*.07, .025, 1900 + 250*(k % 3))
    put(marimba(74 + [0, 3, 5, 7][j], .1, .3), s0 + .6)
put(marimba(74, .1, .3), T[1] + 1.0)
thump(T[1] + 1.9, .2); buzz(T[1] + 1.95)                       # sello SIN PERMISO
click(T[1] + 3.1, .06, 2200); put(marimba(77, .1, .3), T[1] + 3.2)
put(bell(86, .06, .8), T[1] + 3.7); put(bell(89, .05, .8), T[1] + 3.77)
for k in range(9): put(bell(96 + (k*5) % 7, .025, .25), T[2] + .3 + k*.06, pan=(k % 3 - 1)*.5)   # llaves
for j in range(2): put(marimba(76 + j*3, .1, .3), T[2] + 2.6 + j*.15)
click(T[3] + 2.3, .08, 1500); thump(T[3] + 2.32, .18); put(bell(81, .06, 1.0), T[3] + 2.4)   # candado
for j in range(3): put(marimba(74 + j*3, .09, .3), T[3] + 2.6 + j*.4)
for k in range(4): click(T[4] + .2 + k*.3, .04, 600)                                    # pasos
for j in range(6): glide(T[4] + 1.0 + j*.28, 700, 1100, .06, .05)
# cierre
kick(T[5], .5); put(bell(74, .07, 1.6), T[5])
pad([38, 50, 53, 57, 62], T[5], T[5] + 3.6, amp=.07, a=.2, r=1.2, bright=4)
for j, m in enumerate([62, 65, 69, 74, 77]): put(bell(m, .045, 1.2), T[5] + 1.8 + j*.07, pan=(j-2)/3)
for q in range(8): hat(T[5] + 1.8 + q*BEAT/2, .02)
duck_and_mix(.6, .16)
def ir(seed, secs=1.4):
    g = np.random.default_rng(seed); t = np.arange(int(secs*SR))/SR
    x = g.standard_normal(len(t))*np.exp(-t*4); x = sosfilt(butter(1, 6000, fs=SR, output='sos'), x)
    return x/np.sqrt(np.sum(x**2))
oL = L*.9 + fftconvolve(L, ir(5))[:N]*.22; oR = R*.9 + fftconvolve(R, ir(6))[:N]*.22
fade = np.ones(N); fo = int((DUR-1.4)*SR); fade[fo:] = np.linspace(1, 0, N-fo)**1.5
out = np.stack([oL*fade, oR*fade], 1); out *= .89/np.max(np.abs(out))
wavfile.write('audio_cap08.wav', SR, (out*32767).astype(np.int16)); print('ok')
