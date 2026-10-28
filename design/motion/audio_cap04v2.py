"""Music and sound effects for Cap. 04 (25 s), original and synthesized.
Playful groove in D major at 112 bpm, with effects synced to the animation."""
import numpy as np
from scipy.signal import fftconvolve, butter, sosfilt
from scipy.io import wavfile

SR = 48000; DUR = 27.0; N = int(SR * DUR)
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
"""Cap. 04 v2 · Hoy llega alguien nuevo al equipo: swing jazzero a 126 bpm
(contrabajo caminando, platillo con swing, vibráfono y trompeta con sordina)."""
BEAT = 60/126; SW = .1
def vibe(m, t0, d=1.2, a=.05, pan=.2):
    t = np.arange(int(d*SR))/SR; f = hz(m)
    s = (np.sin(2*np.pi*f*t) + .25*np.sin(2*np.pi*4*f*t)*np.exp(-t*8))*np.exp(-t*2.2)*(1+.35*np.sin(2*np.pi*6*t))
    put(a*s*np.minimum(1, t/.004), t0, pan)
def trumpet(m, t0, d=.25, a=.05):
    t = np.arange(int(d*SR))/SR; f = hz(m)*(1+.008*np.sin(2*np.pi*5*t))
    s = sum(np.sin(2*np.pi*np.cumsum(f*k)/SR)/k for k in range(1, 9)); s = sosfilt(butter(2, 1500, fs=SR, output='sos'), s)
    put(a*s*np.minimum(1, t/.03)*np.minimum(1, (d-t)/.05), t0, -.2)
def ride(t0, a=.022):
    n = int(.25*SR); x = sosfilt(butter(2, 6500, btype='high', fs=SR, output='sos'), rng.standard_normal(n)); put(a*x/np.max(np.abs(x))*np.exp(-np.arange(n)/SR*9), t0, .35)
def brush(t0, a=.03):
    n = int(.2*SR); x = sosfilt(butter(2, [1500, 5000], btype='band', fs=SR, output='sos'), rng.standard_normal(n)); put(a*x/np.max(np.abs(x))*np.sin(np.pi*np.arange(n)/n), t0, -.1)
def knock(t0):
    t = np.arange(int(.12*SR))/SR; put(.18*np.sin(2*np.pi*180*t)*np.exp(-t*40), t0)
def realbell(t0, a=.09):
    t = np.arange(int(2.2*SR))/SR; s = sum(aa*np.sin(2*np.pi*2200*r*t)*np.exp(-t/dd) for r, aa, dd in [(1, 1, .9), (2.32, .5, .5), (4.1, .3, .25), (5.4, .2, .18)]); put(a*s, t0, .3)
# entrada: golpes en la puerta, crujido, Punto
knock(.25); knock(.5); glide(.9, 300, 180, .6, .05)
glide(1.6, 300, 1000, .25, .08); vibe(84, 1.65, .8, .05)
t_ = np.arange(int(.35*SR))/SR; f = 560 + 260*np.sin(np.pi*t_/.35)
put(.05*sum(np.sin(2*np.pi*np.cumsum(f)*h/SR)/h**1.5 for h in range(1, 5))*np.sin(np.pi*t_/.35)**1.5, 2.6, -.3)   # miau
for j, m in enumerate([79, 83, 86]): vibe(m, 3.25 + j*.07, 1.0, .05)                                           # credencial
# swing (2.0–22.6): ii-V-I en Fa
CH = [[55, 58, 62, 65], [48, 52, 55, 58], [53, 57, 60, 64], [50, 53, 57, 60]]   # Gm7 C7 Fmaj7 Dm7
WALK = [[43, 46, 50, 53], [48, 52, 55, 58], [41, 45, 48, 52], [50, 48, 46, 45]]
t = 2.0; bar = 0
while t < 22.6:
    ch = CH[bar % 4]; wk = WALK[bar % 4]
    for b in range(4):
        x = t + b*BEAT
        if x >= 22.6: break
        put(pluck(wk[b], .16, .35, .5), x)
        ride(x); ride(x + BEAT*2/3 + .0, .014) if b % 2 else None
        if b % 2: brush(x)
    for j, m in enumerate(ch): vibe(m+12, t + BEAT*1.66 + j*.01, 1.0, .022, pan=(j-1.5)/4)
    t += 4*BEAT; bar += 1
for k, tt in enumerate([5.0, 11.0, 16.8]): swoosh(tt - .1, .7, .1); trumpet(72 + 2*k, tt + .5, .2); trumpet(76 + 2*k, tt + .75, .35)   # paneos
for i, tt in enumerate([6.4, 7.6, 8.8]): glide(tt, 400, 700, .1, .07); swoosh(tt + 1.3, .3, .05); vibe(77 + 2*i, tt + 1.8, .5, .05)
glide(12.6, 220, 160, .35, .05)                                          # cajón
for tt, m in [(13.4, 81), (13.9, 84), (14.4, 88)]: vibe(m, tt, .6, .07); click(tt, .05)
for k in range(16): click(15.0 + k*.05, .03, 900 + 60*(k % 3))         # impresora
vibe(89, 15.8, .8, .07)
for k in range(4): put(marimba(66 - k, .05, .15), 18.8 + k*.18)          # nervios
realbell(20.2)
swoosh(21.0, .5, .07); vibe(84, 21.6, .8, .07); trumpet(77, 21.7, .2); trumpet(81, 21.95, .4)
swoosh(22.55, .5, .12)
# cierre (23–27)
pad([53, 57, 60, 64], 23.2, 24.8, amp=.05, a=.3, r=.3)
for j, m in enumerate([65, 69, 72, 76]): vibe(m, 23.2 + j*.08, 1.4, .04)
pad([41, 53, 57, 60, 64, 67], 24.8, 26.4, amp=.07, a=.1, r=.6, bright=4)
for j, m in enumerate([72, 76, 79, 84, 88]): vibe(m, 24.8 + j*.06, 1.4, .05, pan=(j-2)/3)
trumpet(77, 25.0, .2); trumpet(81, 25.25, .2); trumpet(84, 25.5, .7)
def ir(seed, secs=1.6):
    g = np.random.default_rng(seed); t = np.arange(int(secs*SR))/SR
    x = g.standard_normal(len(t))*np.exp(-t*3.4); x = sosfilt(butter(1, 6000, fs=SR, output='sos'), x); return x/np.sqrt(np.sum(x**2))
oL = L*.85 + fftconvolve(L, ir(21))[:N]*.32; oR = R*.85 + fftconvolve(R, ir(22))[:N]*.32
fade = np.ones(N); fo = int(26.2*SR); fade[fo:] = np.linspace(1, 0, N-fo)**1.5
out = np.stack([oL*fade, oR*fade], 1); out *= .89/np.max(np.abs(out))
wavfile.write('audio_cap04v2.wav', SR, (out*32767).astype(np.int16)); print('ok')
