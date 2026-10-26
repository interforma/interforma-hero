"""Music and sound effects for Cap. 04 (25 s), original and synthesized.
Playful groove in D major at 112 bpm, with effects synced to the animation."""
import numpy as np
from scipy.signal import fftconvolve, butter, sosfilt
from scipy.io import wavfile

SR = 48000; DUR = 18.0; N = int(SR * DUR)
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
"""Cap. 03 · La ronda: rasgueo tipo ukelele + silbido + palmas, La mayor a 104 bpm.
Cada planilla suena más aguda; el gato maúlla; la torre cruje."""
BEAT = 60/104
def strum(ms, t0, a=.05, down=True):
    for j, m in enumerate(ms if down else ms[::-1]): put(pluck(m, a, .35, 2.2), t0 + j*.014, pan=(j-1.5)/5)
def whistle(m, t0, d, a=.05):
    t = np.arange(int(d*SR))/SR; f = hz(m)*(1+.006*np.sin(2*np.pi*5.5*t))
    put(a*np.sin(2*np.pi*np.cumsum(f)/SR)*np.minimum(1, t/.04)*np.minimum(1, (d-t)/.08), t0, pan=.2)
def clap(t0, a=.07):
    for dt in (0, .011, .022):
        n = int(.1*SR); x = sosfilt(butter(2, [900, 4200], btype='band', fs=SR, output='sos'), rng.standard_normal(n)); put(a*x/np.max(np.abs(x))*np.exp(-np.arange(n)/SR*45), t0+dt)
CH = [[57, 61, 64, 69], [54, 57, 61, 66], [50, 54, 57, 62], [52, 56, 59, 64]]   # A F#m D E
t = .2; bar = 0
while t < 16.4:
    ch = CH[bar % 4]
    for b, (dn, a) in enumerate([(1, .05), (1, .03), (0, .035), (1, .03), (0, .04), (1, .03), (0, .035), (1, .03)]):
        x = t + b*BEAT/2
        if x < 16.4: strum(ch, x, a*.9, bool(dn))
    put(pluck(ch[0]-12, .13, .5, .6), t); put(pluck(ch[0]-12, .1, .5, .6), t + 2*BEAT)
    if t > 1.8: clap(t + BEAT); clap(t + 3*BEAT)
    t += 4*BEAT; bar += 1
# silbido: tema corto al inicio y al final
for m, t0, d in [(76, .5, .3), (78, .85, .3), (81, 1.2, .55), (76, 13.4, .3), (78, 13.75, .3), (81, 14.1, .3), (85, 14.45, .8)]: whistle(m, t0, d)
# planillas: golpe + nota que sube (el contador)
for i, t0 in enumerate([2.0, 2.7, 3.4, 4.1, 4.9, 5.7]):
    thump(t0 + .42, .16); put(marimba(72 + 2*i, .13, .3), t0 + .45); click(t0 + .45, .05, 1600)
glide(5.35, 500, 1100, .2, .07)                           # «solo por mientras»: sorpresa
for k in range(6): click(6.0 + k*.13, .025, 2400)          # pasitos del gato
glide(6.8, 300, 900, .4, .07)                              # salto
t_ = np.arange(int(.35*SR))/SR; f = 560 + 260*np.sin(np.pi*t_/.35)
put(.05*sum(np.sin(2*np.pi*np.cumsum(f)*h/SR)/h**1.5 for h in range(1, 5))*np.sin(np.pi*t_/.35)**1.5, 7.3, -.3)   # miau
for k in range(4): glide(7.0 + k*.35, 180, 140, .3, .05)  # crujido de la torre
put(marimba(64, .1, .4), 10.7); put(marimba(60, .1, .5), 10.95)   # «más de tres» hmm
for j, m in enumerate([69, 73, 76, 81, 85]): put(bell(m, .05, 1.0), 13.4 + j*.05, pan=(j-2)/3)
pad([57, 64, 69, 73, 76], 16.4, 17.6, amp=.06, a=.05, r=.6, bright=3); strum([57, 61, 64, 69, 73], 16.4, .07)
def ir(seed, secs=1.4):
    g = np.random.default_rng(seed); t = np.arange(int(secs*SR))/SR
    x = g.standard_normal(len(t))*np.exp(-t*4); x = sosfilt(butter(1, 6000, fs=SR, output='sos'), x); return x/np.sqrt(np.sum(x**2))
oL = L*.88 + fftconvolve(L, ir(2))[:N]*.28; oR = R*.88 + fftconvolve(R, ir(3))[:N]*.28
fade = np.ones(N); fo = int(17.2*SR); fade[fo:] = np.linspace(1, 0, N-fo)**1.5
out = np.stack([oL*fade, oR*fade], 1); out *= .89/np.max(np.abs(out))
wavfile.write('audio_reel03.wav', SR, (out*32767).astype(np.int16)); print('ok')
