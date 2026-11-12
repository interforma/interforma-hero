"""Música original y efectos de la semana 47 (16–20 nov 2026). Uso: python3 audio_semana47.py <pieza>
news01  Punto lee las noticias Ep. 01 · reggae suave con órgano, 78 bpm (26,5 s)
news02  Punto lee las noticias Ep. 02 · tango electrónico con bandoneón, 120 bpm (29,5 s)
cap11   Cap. 11 · funk disco con bajo slap y clavinet, 116 bpm (32 s)
barrio03 Barrio Ep. 03 · chiptune 8-bit, 140 bpm (31 s)
caso03  Caso 03 · son cubano con tres, clave 3-2 y bongó, 100 bpm (34 s)"""
import sys
PIECE = sys.argv[1]
DUR = {'news01': 26.5, 'news02': 29.5, 'cap11': 32.0, 'barrio03': 31.0, 'caso03': 34.0}[PIECE]
import numpy as np
from scipy.signal import fftconvolve, butter, sosfilt
from scipy.io import wavfile

SR = 48000; N = int(SR * DUR)
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
def pop(t0, a=.09): glide(t0, 500, 1300, .09, a)
def noise(t0, d, lo, hi, a, pan=0, decay=8):
    n = int(d*SR); x = sosfilt(butter(2, [lo, hi], btype='band', fs=SR, output='sos'), rng.standard_normal(n))
    put(a*x/np.max(np.abs(x))*np.exp(-np.linspace(0, decay, n)), t0, pan)
def snare(t0, a=.08): noise(t0, .18, 1200, 7000, a, .1, 9); put(.5*a*np.sin(2*np.pi*190*np.arange(int(.08*SR))/SR)*np.exp(-np.arange(int(.08*SR))/SR*40), t0)
def hat(t0, a=.025, d=.05): noise(t0, d, 6000, 14000, a, .35, 10)
def organ(ms, t0, d, a=.03, pan=-.3):
    t = np.arange(int(d*SR))/SR; s = sum(np.sin(2*np.pi*hz(m)*k*t)/k for m in ms for k in (1, 2, 4))
    put(a*s/len(ms)*np.minimum(1, t/.005)*np.minimum(1, (d-t)/.02), t0, pan)
def square(m, t0, d, a=.03, pan=0, duty=.5):
    t = np.arange(int(d*SR))/SR; ph = (hz(m)*t) % 1; s = np.where(ph < duty, 1., -1.)
    put(a*s*np.minimum(1, (d-t)/.01), t0, pan)
def tri(m, t0, d, a=.08):
    t = np.arange(int(d*SR))/SR; ph = (hz(m)*t) % 1; put(a*(4*np.abs(ph-.5)-1)*np.minimum(1, (d-t)/.01), t0)
def bando(m, t0, d, a=.04, pan=.15):
    t = np.arange(int(d*SR))/SR; f = hz(m)*(1+.003*np.sin(2*np.pi*6*t))
    s = sum(np.sign(np.sin(2*np.pi*np.cumsum(f*k)/SR))/k**1.4 for k in (1, 2))
    s = sosfilt(butter(2, 2200, fs=SR, output='sos'), s); put(a*s*np.minimum(1, t/.02)*np.minimum(1, (d-t)/.04), t0, pan)
def subbass(m, t0, d, a=.14):
    t = np.arange(int(d*SR))/SR; put(a*np.tanh(1.6*np.sin(2*np.pi*hz(m)*t))*np.exp(-t*1.5)*np.minimum(1, (d-t)/.02), t0)
def bongo(t0, hi=True, a=.07):
    t = np.arange(int(.15*SR))/SR; f = (420 if hi else 300)*(1+.3*np.exp(-t*60)); put(a*np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*30), t0, .3 if hi else -.2)
def clave(t0, a=.06):
    t = np.arange(int(.08*SR))/SR; put(a*np.sin(2*np.pi*2500*t)*np.exp(-t*60), t0, -.35)
def outro(T, root):
    pad([root, root+7, root+12, root+16], T+.1, T+2.4, amp=.06, a=.4, r=.4)
    pad([root+5, root+12, root+17, root+21], T+1.3, T+3.6, amp=.06, a=.4, r=.6)
    for j, m in enumerate([root+24, root+28, root+31, root+36, root+40]): put(bell(m, .05, 1.0), T+2.2 + j*.05, pan=(j-2)/3)
    for j, m in enumerate([root, root+7, root+12, root+16, root+19, root+24]): put(pluck(m, .05, 2.0), T+3.2 + j*.04)

if PIECE == 'news01':
    B = 60/78; T = 21.0; ch = [[57, 60, 64], [62, 66, 69], [55, 59, 62], [62, 66, 69]]   # Am D G D
    noise(.5, .5, 800, 4000, .05, .2, 4)                                                # diario que llega
    t = 0.0; bar = 0
    while t < T - .2:
        c = ch[bar % 4]
        for b in range(4):
            x = t + b*B
            if x >= T - .2: break
            organ([m+12 for m in c], x + B/2, B*.3, .035)                              # skank a contratiempo
            if b == 2: thump(x, .2); snare(x, .07)                                       # one drop
            hat(x + B/2, .02)
        subbass(c[0]-12, t, B*1.5, .13); subbass(c[0]-5, t + 2.5*B, B*1.2, .1)
        t += 4*B; bar += 1
    for a in (4.0, 8.0, 12.0, 16.0): noise(a, .35, 900, 5000, .05, .3, 6)                 # vuelta de página
    for i in range(3): pop(8.3 + i*.45, .07)
    for i in range(4): pop(12.6 + i*.3, .06)
    glide(16.8, 300, 600, .8, .05, np.sign)                                              # plumón que encierra el 22
    for j, m in enumerate([81, 84, 88]): put(bell(m, .05, .8), 18.6 + j*.06)
    swoosh(T-.4, .5, .12); outro(T, 45)
elif PIECE == 'news02':
    B = 60/120; T = 24.0; ch = [[50, 53, 57], [55, 58, 62], [45, 49, 52], [50, 53, 57]]   # Dm Gm A Dm
    t = 0.0; bar = 0
    while t < T - .2:
        c = ch[bar % 4]
        for b in range(4):                                                               # marcato de tango
            x = t + b*B; amp = .045 if b in (0, 2) else .03
            for m in c: put(pluck(m, amp/2, .15, 1.6), x, -.2)
        subbass(c[0]-12, t, B*.6, .14); subbass(c[0]-12, t + 1.5*B, B*.4, .1); subbass(c[0]-5, t + 2*B, B*.6, .12)  # habanera
        thump(t, .18); thump(t + 2*B, .14); hat(t + 3.5*B, .03)
        t += 4*B; bar += 1
    mel = [(74, 1.0, .5), (72, 1.5, .5), (70, 2.0, .5), (69, 2.5, 1.0), (77, 4.2, .5), (76, 4.7, .5), (74, 5.2, 1.0),
           (74, 14.2, .5), (77, 14.7, .5), (81, 15.2, 1.0), (79, 19.2, .5), (77, 19.7, .5), (76, 20.2, .5), (74, 20.7, 1.5)]
    for m, a, d in mel: bando(m, a, d)
    for k, x in enumerate([10.1, 10.6, 11.1, 11.6, 12.1]):                               # caja registradora
        put(bell(96, .06, .3), x); noise(x, .12, 2000, 8000, .04, .2, 12)
    for k in range(14): click(9.0 + k*3.4/14, .03, 1800)                               # contador
    pop(4.6, .07); pop(5.2, .07); glide(20.0, 900, 300, .4, .05)                         # tachado
    swoosh(T-.4, .5, .12); outro(T, 50)
elif PIECE == 'cap11':
    B = 60/116; T = 26.6; ch = [[52, 55, 59, 62], [57, 60, 64, 67]]                      # Em7 Am7
    for k in range(20): click(.2 + k*.24, .03, 2200 + (k % 2)*600)                     # Ctrl+C / Ctrl+V
    t = 0.0; bar = 0
    while t < T - .2:
        c = ch[bar % 2]; on = t >= 4.6
        for s16 in range(16):
            x = t + s16*B/4
            if x >= T - .2: break
            if on: hat(x, .018 if s16 % 2 else .03, .04)
            if on and s16 in (0, 6, 10): subbass(c[0]-12, x, B*.35, .15)
            if on and s16 in (3, 14): put(pluck(c[0], .09, .08, 3.0), x)              # slap
            if on and s16 in (2, 7, 11, 15): organ([m+12 for m in c[1:]], x, B*.12, .03, .25)  # clavinet
        if on:
            for b in range(4): thump(t + b*B, .17)
            snare(t + B, .06); snare(t + 3*B, .06)
        else:
            pad([m for m in c], t, t+4*B, amp=.035, a=.3, r=.2)
        t += 4*B; bar += 1
    glide(4.6, 300, 1100, .25, .08)
    put(pluck(60, .08, .6), 5.6)                                                        # plumón
    for a in (10.2, 14.2, 18.2):
        pop(a, .07); click(a+.6, .07, 900); click(a+.8, .06, 800); pop(a+1.2, .08); put(marimba(84, .08, .25), a+1.8)
    for j, m in enumerate([76, 79, 83, 88]): put(bell(m, .05, .8), 22.4 + j*.06)
    swoosh(T-.4, .5, .12); outro(T, 52)
elif PIECE == 'barrio03':
    B = 60/140; T = 25.6
    for i in range(7): square(84 + (i % 3)*3, .5 + i*.55, .08, .025, .3)               # «¿me la guardas?»
    prog_ = [[60, 64, 67], [57, 60, 64], [53, 57, 60], [55, 59, 62]]                    # C Am F G
    mel = [72, 76, 79, 76, 74, 72, 74, 76, 77, 76, 74, 72, 71, 72, 74, 79]
    t = 0.0; bar = 0
    while t < T - .2:
        c = prog_[bar % 4]
        for b in range(8):
            x = t + b*B/2
            if x >= T - .2: break
            tri(c[0]-12 + (12 if b % 2 else 0), x, B*.45, .07)
            square(c[b % 3]+12, x, B*.2, .012, -.3, .25)
            if b % 2 == 0: noise(x, .03, 5000, 12000, .02, .3, 14)
            if t >= 4.8: square(mel[(bar*8 + b) % 16], x, B*.4, .016, .2, .5)
        t += 4*B; bar += 1
    for i in range(14): square(88 + (i % 4)*2, 5.4 + i*.18, .05, .02, .2)                 # prendas al probador
    glide(6.0, 300, 1100, .25, .08)
    for a in (11.0, 13.6, 16.2, 18.8): pop(a, .07)
    for j, m in enumerate([88, 91, 88, 91]): put(bell(m, .05, .4), 16.5 + j*.12, pan=.4)  # recordatorio
    for j, m in enumerate([84, 88, 91, 96]): square(m, 20.0 + j*.08, .08, .03, .2)       # ¡vendida!
    swoosh(T-.4, .5, .12); outro(T, 48)
elif PIECE == 'caso03':
    B = 60/100; T = 28.4; ch = [[55, 59, 62], [50, 54, 57], [55, 59, 62], [50, 54, 57]]   # G D G D
    t = 0.0; bar = 0
    while t < T - .2:
        c = ch[bar % 4]
        for x in (0, 1.5, 3) if bar % 2 == 0 else (1, 2): clave(t + x*B, .05)           # clave 3-2
        subbass(c[0]-12, t + 1.5*B, B*.9, .13); subbass(c[0]-12, t + 3*B, B*.9, .12)    # tumbao
        for s8 in range(8):
            x = t + s8*B/2
            if x >= T - .2: break
            if s8 in (1, 2, 4, 6, 7): put(pluck(c[s8 % 3]+12, .05, .25, 2.0), x, .25)   # tres (montuno)
            bongo(x, s8 % 2 == 1, .04 if t > 4 else .02)
        t += 4*B; bar += 1
    for x in (4.8, 6.0, 7.0, 10.9, 11.6, 12.6, 14.0, 17.0, 17.8): put(bell(88, .04, .25), x, .3)   # mensajes
    for i in range(6): pop(5.6 + i*.35, .05)
    glide(11.6, 600, 400, .3, .05); glide(3.8, 300, 1100, .25, .08)
    for j, m in enumerate([79, 83, 86, 91]): put(bell(m, .05, .7), 17.8 + j*.06)
    for i in range(4): pop(22.6 + i*.4, .06)
    swoosh(T-.4, .5, .12); outro(T, 43)

def ir(seed, secs=1.4):
    g = np.random.default_rng(seed); t = np.arange(int(secs*SR))/SR
    x = g.standard_normal(len(t))*np.exp(-t*4); x = sosfilt(butter(1, 6000, fs=SR, output='sos'), x); return x/np.sqrt(np.sum(x**2))
oL = L*.88 + fftconvolve(L, ir(12))[:N]*.25; oR = R*.88 + fftconvolve(R, ir(13))[:N]*.25
fade = np.ones(N); fo = int((DUR-1.0)*SR); fade[fo:] = np.linspace(1, 0, N-fo)**1.5
out = np.stack([oL*fade, oR*fade], 1); out *= .89/np.max(np.abs(out))
wavfile.write(f'audio_{PIECE}.wav', SR, (out*32767).astype(np.int16)); print('ok', PIECE)
