"""Cap. 09 B · ¿Qué es un CRM? (tienda de ropa, 32 s). Indie-pop a 116 bpm en Si bemol mayor: piano eléctrico,
bajo sintetizado y chasquidos de dedos. Pings de mensajes, batería que se agota, pops de la ficha y campanita."""
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
BEAT = 60/116
def epiano(m, t0, d, a=.05, pan=0):
    t = np.arange(int((d+.6)*SR))/SR; f = hz(m)
    s = np.sin(2*np.pi*f*t + 1.2*np.sin(2*np.pi*f*t)*np.exp(-t*6))*np.exp(-t*2.2)
    s *= np.minimum(1, t/.004)*np.where(t > d, np.exp(-(t-d)*10), 1); put(a*s, t0, pan)
def snap(t0, a=.05):
    n = int(.06*SR); x = sosfilt(butter(2, [1800, 6000], btype='band', fs=SR, output='sos'), rng.standard_normal(n))
    put(a*x/np.max(np.abs(x))*np.exp(-np.linspace(0, 9, n)), t0, .3)
def bass(m, t0, d, a=.14):
    t = np.arange(int(d*SR))/SR; s = np.tanh(2*np.sin(2*np.pi*hz(m)*t)); put(a*s*np.minimum(1, t/.01)*np.exp(-t*2), t0)
def ping(t0, a=.05, m=88): put(bell(m, a, .25), t0, .35); put(bell(m+7, a*.6, .2), t0+.05, .35)
def pop(t0, a=.09): glide(t0, 500, 1300, .09, a)
def groove(t0, t1, prog_, amp=1.0, drums=True):
    t = t0; bar = 0
    while t < t1 - 1e-6:
        ch = prog_[bar % len(prog_)]
        for b in range(4):
            x = t + b*BEAT
            if x >= t1: break
            bass(ch[0]-12, x, BEAT*.9, .12*amp)
            if b in (0, 2): epiano(ch[1]+12, x, BEAT*.8, .03*amp, -.2); epiano(ch[2]+12, x+.01, BEAT*.8, .03*amp, -.2)
            else: epiano(ch[0]+12, x + BEAT/2, BEAT*.4, .025*amp, .2)
            if drums:
                if b in (1, 3): snap(x, .06*amp)
                else: thump(x, .14*amp)
                click(x + BEAT/2, .015*amp, 5000)
        t += 4*BEAT; bar += 1
P1 = [[46, 50, 53], [43, 46, 50], [39, 43, 46], [41, 45, 48]]     # Bb Gm Eb F
P2 = [[39, 43, 46], [46, 50, 53], [41, 45, 48], [46, 50, 53]]     # Eb Bb F Bb
groove(0.0, 5.0, P1, .7, drums=False)
for i in range(5): ping(.6 + i*.55, .05, 86 + (i % 2)*3)
groove(5.0, 8.4, P1, .9)
for i in range(14): ping(5.0 + i*3.0/14, .035, 84 + (i*5) % 12)
glide(8.4, 700, 160, 1.2, .08); glide(8.9, 500, 120, .9, .05)          # batería se agota
for k in range(3): click(9.0 + k*.25, .03, 1300)
glide(10.0, 300, 1100, .25, .08)
groove(10.2, 26.6, P2, 1.0)
for m, t0 in [(77, 10.6), (82, 11.9), (81, 12.6), (77, 13.9), (74, 15.2), (77, 16.5), (79, 17.8), (81, 19.1),
              (82, 21.0), (86, 21.6), (84, 22.3), (82, 23.0), (81, 23.9), (84, 24.5), (86, 25.1), (89, 25.8)]: epiano(m, t0, .5, .04, .1)
pop(10.6, .08)
for a in (11.6, 15.9, 17.5, 19.8): pop(a, .08); put(marimba(84, .08, .25), a+.5)
for j, m in enumerate([88, 91, 88, 91, 88]): put(bell(m, .05, .4), 20.4 + j*.12, pan=.4)
for j in range(3): pop(23.9 + j*.22, .07)
swoosh(26.6, .5, .12)
pad([46, 53, 58, 62], 27.1, 29.4, amp=.06, a=.4, r=.4)
pad([39, 51, 55, 58], 28.3, 30.6, amp=.06, a=.4, r=.6)
for m, t0 in [(77, 27.3), (82, 27.9), (86, 28.4), (84, 28.9), (82, 29.4)]: epiano(m, t0, .5, .04)
for j, m in enumerate([70, 74, 77, 82, 86]): put(bell(m, .05, 1.0), 29.2 + j*.05, pan=(j-2)/3)
for j, m in enumerate([46, 53, 58, 62, 65, 70]): put(pluck(m, .05, 2.0), 30.2 + j*.04)
def ir(seed, secs=1.4):
    g = np.random.default_rng(seed); t = np.arange(int(secs*SR))/SR
    x = g.standard_normal(len(t))*np.exp(-t*4); x = sosfilt(butter(1, 6000, fs=SR, output='sos'), x); return x/np.sqrt(np.sum(x**2))
oL = L*.88 + fftconvolve(L, ir(12))[:N]*.28; oR = R*.88 + fftconvolve(R, ir(13))[:N]*.28
fade = np.ones(N); fo = int(31.0*SR); fade[fo:] = np.linspace(1, 0, N-fo)**1.5
out = np.stack([oL*fade, oR*fade], 1); out *= .89/np.max(np.abs(out))
wavfile.write('audio_cap09b.wav', SR, (out*32767).astype(np.int16)); print('ok')
