"""Music and sound effects for Cap. 04 (25 s), original and synthesized.
Playful groove in D major at 112 bpm, with effects synced to the animation."""
import numpy as np
from scipy.signal import fftconvolve, butter, sosfilt
from scipy.io import wavfile

SR = 48000; DUR = 48.0; N = int(SR * DUR)
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
"""Método Interforma: lo-fi electrónico a 96 bpm, por capas. Cada etapa suma o cambia
un instrumento; la parte 6 sube de Fa a Sol. Distinto al groove de marimba de los casos."""
BEAT = 60/96; SW = .07   # swing
MS = [5.0, 11.0, 17.0, 23.5, 29.5, 35.5, 41.5]
def sec(t):
    for i in range(6):
        if t < MS[i+1]: return i
    return 6

def epiano(m, dur=1.2, amp=.06):
    f = hz(m); t = np.arange(int((dur+1.2)*SR))/SR
    idx = 1.6*np.exp(-t*3.5)
    s = np.sin(2*np.pi*f*t + idx*np.sin(2*np.pi*f*t)) + .25*np.sin(2*np.pi*2*f*t)*np.exp(-t*6)
    env = np.minimum(1, t/.004)*np.exp(-t*1.1); env[int(dur*SR):] *= np.linspace(1, 0, len(t)-int(dur*SR))**2
    return amp*s*env*(1+.12*np.sin(2*np.pi*4.5*t))
def kick(t0, a=.32):
    t = np.arange(int(.35*SR))/SR; f = 45 + 95*np.exp(-t*28)
    put(a*np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*9), t0)
def snare(t0, a=.12):
    n = int(.22*SR); t = np.arange(n)/SR; x = sosfilt(butter(2, [1200, 7000], btype='band', fs=SR, output='sos'), rng.standard_normal(n))
    put(a*(x/np.max(np.abs(x))*np.exp(-t*18) + .5*np.sin(2*np.pi*185*t)*np.exp(-t*30)), t0)
def hat(t0, a=.03, d=40):
    n = int(.08*SR); t = np.arange(n)/SR; x = sosfilt(butter(2, 7000, btype='high', fs=SR, output='sos'), rng.standard_normal(n))
    put(a*x/np.max(np.abs(x))*np.exp(-t*d), t0, pan=.25)
def clap(t0, a=.09):
    for k, dt in enumerate([0, .012, .024]):
        n = int(.12*SR); t = np.arange(n)/SR; x = sosfilt(butter(2, [900, 4000], btype='band', fs=SR, output='sos'), rng.standard_normal(n))
        put(a*x/np.max(np.abs(x))*np.exp(-t*(60 if k < 2 else 22)), t0+dt, pan=-.15)
def rim(t0, a=.05): click(t0, a, 1700)
def bass(m, t0, dur, a=.13):
    f = hz(m); t = np.arange(int(dur*SR))/SR
    s = np.sin(2*np.pi*f*t) + .3*np.sin(2*np.pi*2*f*t)
    put(a*s*np.minimum(1, t/.01)*np.exp(-t*1.8)*np.minimum(1, (dur-t)/.05), t0)
def arp(m, t0, a=.035):
    f = hz(m); t = np.arange(int(.18*SR))/SR
    s = sum(np.sin(2*np.pi*f*k*t)/k for k in (1, 3, 5, 7))
    put(a*s*np.exp(-t*16), t0, pan=.4*np.sin(t0*3))
def tom(t0, m=45, a=.12):
    t = np.arange(int(.3*SR))/SR; f = hz(m)*(1+.6*np.exp(-t*20))
    put(a*np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*10), t0)
def pizz(m, t0, a=.09): put(pluck(m, a, .22, 1.3), t0, pan=-.3)

F_CH = [[53,57,60,64],[50,53,57,60,64],[46,50,53,57],[48,52,55,57,62]]   # Fmaj7 Dm9 Bbmaj7 C6/9
G_CH = [[55,59,62,66],[52,55,59,62,66],[48,52,55,59],[50,54,57,59]]      # Gmaj7 Em9 Cmaj7 D6

# ---------- Gancho: caos (0–4.4) ----------
t = np.arange(int(4.4*SR))/SR
drone = sum(np.sin(2*np.pi*hz(33+d)*k*t)/k**1.3 for d in (-.12, .12, 1) for k in (1, 2, 3))
put(.05*drone/6*np.minimum(1, t/1.0)*np.minimum(1, (3.6-t).clip(0)/.15), 0)
tt = .3; step = .42
while tt < 3.55: click(tt, .05, 2200); tt += step; step = max(.12, step*.92)      # reloj que acelera
for k in range(14):
    m = 60 + int(rng.integers(0, 13)); put(marimba(m, .07, .25), .6 + k*.21 + rng.uniform(0, .06), pan=rng.uniform(-.7, .7))
for k in range(4): glide(.95 + k*1.0, 1800, 1200, .08, .03)                       # gotas de sudor
n = int(1.1*SR); x = sosfilt(butter(2, [800, 6000], btype='band', fs=SR, output='sos'), rng.standard_normal(n))
put(.06*x/np.max(np.abs(x))*np.linspace(0, 1, n)**2, 2.5)                       # riser
# respira (3.6–4.4) y rueda hacia la etapa 1
n = int(.8*SR); x = sosfilt(butter(2, [300, 1500], btype='band', fs=SR, output='sos'), rng.standard_normal(n))
put(.05*x/np.max(np.abs(x))*np.sin(np.pi*np.linspace(0, 1, n)), 3.6)
pad([53, 60, 64], 3.7, 4.6, amp=.04, a=.5, r=.4)
glide(4.4, 300, 900, .55, .07); swoosh(4.45, .5, .09)
for k, m in enumerate([45, 48, 52]): tom(4.62 + k*.11, m)

# ---------- Groove por capas (5.0–41.5) ----------
stop = [(19.75, 20.9)]                                     # el bloque chueco frena la música
muted = lambda x: any(a <= x < b for a, b in stop)
tb = 5.0; bar = 0
while tb < 41.5 - 1e-6:
    s = sec(tb); CH = G_CH if s == 5 else F_CH; ch = CH[bar % 4]
    if not muted(tb):
        soft = (s == 4 and tb < 33.2)
        put(epiano(ch[0]-12 if s != 4 else ch[0], 4*BEAT*.95, .045), tb)
        for j, m in enumerate(ch[1:]): put(epiano(m, 4*BEAT*.95, .03), tb + j*.012, pan=(j-1.5)/4)
        if s >= 1: pad(ch, tb, tb + 4*BEAT, amp=.022, a=.4, r=.4, bright=2)
    for b in range(8):                                     # corcheas
        x = tb + b*BEAT/2 + (SW if b % 2 else 0)
        if x >= 41.5 or muted(x): continue
        soft = (s == 4 and x < 33.2)
        if b in (0, 5) or (b == 4 and s >= 2): kick(x, .22 if soft else .3)
        if b in (2, 6):
            if s == 0 or soft: rim(x)
            else: snare(x, .11)
            if s == 5: clap(x)
        if not soft: hat(x, .028 if b % 2 else .02)
        if s >= 2 and b % 2 == 0: bass(ch[0]-12, x, BEAT/2*.9, .12 if not soft else .08)
        if s >= 3 and s != 4:                              # arpegio en semicorcheas
            for h in range(2): arp(ch[(b*2+h) % len(ch)]+12, x + h*BEAT/4)
    if s == 0 and not muted(tb):                           # pizzicato curioso
        for j, m in enumerate([72, 74, 75, 77]): pizz(m if bar % 2 == 0 else m-2, tb + 2*BEAT + j*BEAT/2)
    tb += 4*BEAT; bar += 1

# ---------- Efectos por etapa ----------
for i in range(5): swoosh(MS[i+1]-.6, .55, .1); glide(MS[i+1]-.55, 350, 1000, .45, .06); tom(MS[i+1]-.12, 50, .1)
# 1 Diagnóstico
for j in range(3): click(5.0+1.75+j*.15, .04, 1400)
for j, m in enumerate([84, 88, 91]): put(bell(m, .07, .8), 8.0 + j*.05)
glide(8.0, 500, 1300, .15, .08)
# 2 Diseño
glide(12.35, 400, 1500, .25, .08); [put(bell(m, .06, 1.0), 12.45 + j*.05) for j, m in enumerate([81, 84, 88, 93])]
for i, m in enumerate([72, 74, 77, 79, 81]): put(marimba(m, .1, .3), 12.9 + i*.42); click(12.9 + i*.42, .04)
# 3 Implementación: bloques, error y arreglo
for x in [18.45, 18.85, 19.25, 21.55, 21.95]: thump(x, .18); click(x, .05, 900)
thump(19.75, .22)
for k, m in enumerate([58, 57, 56, 54]):                   # "uaa uaa" triste
    t = np.arange(int(.32*SR))/SR; f = hz(m)*(1+.02*np.sin(2*np.pi*6*t))
    s_ = sum(np.sin(2*np.pi*np.cumsum(f)*h/SR)/h for h in range(1, 8)); s_ = sosfilt(butter(2, 1400, fs=SR, output='sos'), s_)
    put(.09*s_*np.sin(np.pi*t/.32), 19.85 + k*.3 - (.0 if k < 3 else -.05))
glide(20.4, 200, 900, .5, .08); click(20.9, .08, 2600); put(bell(86, .06, .6), 20.92)
# 4 Integración
glide(25.5, 500, 1400, .2, .08)
for i, m in enumerate([76, 79, 83, 88]): put(bell(m, .06, .8), 23.5 + 1.95 + i*.45); click(23.5 + 1.95 + i*.45, .04, 3000)
# 5 Adopción: nervios → confianza
for k in range(10): put(marimba(69 if k % 2 else 70, .03, .15), 30.2 + k*.18)
for i, m in enumerate([77, 81, 84]): put(bell(m, .07, 1.0), 32.4 + i*.4)
# 6 Optimización (Sol)
for i, m in enumerate([67, 71, 74, 78, 79]): put(marimba(m, .12, .35), 36.6 + i*.22)
glide(37.9, 400, 1200, .7, .05)
for j, m in enumerate([79, 83, 86, 91, 95]): put(bell(m, .06, 1.0), 38.7 + j*.06, pan=(j-2)/3)
swoosh(41.05, .5, .12)

# ---------- Cierre (41.5–48) ----------
pad([43, 55, 59, 62, 66, 69], 41.6, 46.6, amp=.07, a=1.2, r=1.4, bright=3)
put(epiano(55, 2.0, .05), 41.7); put(epiano(62, 2.0, .04), 41.72); put(epiano(66, 2.0, .04), 41.74)
for j, m in enumerate([79, 81, 83, 86, 88, 91]): put(bell(m, .06, .9), 43.5 + j*.2, pan=(j-2.5)/3); put(marimba(m-12, .06, .3), 43.5 + j*.2)
for k in range(3): thump(45.1 + k*1.0, .07)
for j, m in enumerate([55, 62, 67, 71, 74, 79]): put(pluck(m, .045, 2.2), 45.9 + j*.04)

# polvillo de vinilo durante el groove
for k in range(260): click(rng.uniform(5, 41.5), .006*rng.uniform(.3, 1), rng.uniform(2000, 6000))

def ir(seed, secs=1.8):
    g = np.random.default_rng(seed); t = np.arange(int(secs*SR))/SR
    x = g.standard_normal(len(t))*np.exp(-t*3.2); x = sosfilt(butter(1, 5500, fs=SR, output='sos'), x)
    return x/np.sqrt(np.sum(x**2))
oL = L*.85 + fftconvolve(L, ir(5))[:N]*.33; oR = R*.85 + fftconvolve(R, ir(6))[:N]*.33
fade = np.ones(N); fo = int(46.8*SR); fade[fo:] = np.linspace(1, 0, N-fo)**1.5
out = np.stack([oL*fade, oR*fade], 1); out *= .89/np.max(np.abs(out))
wavfile.write('audio_metodo.wav', SR, (out*32767).astype(np.int16)); print('ok')
