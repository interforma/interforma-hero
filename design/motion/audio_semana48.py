"""Música original y efectos de la semana 48 (25 nov – 3 dic 2026). Uso: python3 audio_semana48.py <pieza>
caso04  surf rock con guitarra en trémolo, 150 bpm · cap12 jazz manouche, 200 bpm · barrio04 ska con metales, 160 bpm
cap13   banda de bronces con bombo, 120 bpm · news03 cortina de noticiero (timbales, bronces y pulso), 120 bpm
barrio05 caja de música (noche) que pasa a pop acústico (amanecer) · cap14 bluegrass con banjo, 130 bpm
cuida01 jazz noir con contrabajo en pizzicato, vibráfono y grillos, 92 bpm"""
import sys
PIECE = sys.argv[1]
DUR = {'caso04': 32.6, 'cap12': 30.6, 'barrio04': 30.6, 'cap13': 30.6, 'news03': 28.6, 'barrio05': 30.6, 'cap14': 30.6, 'cuida01': 30.6}[PIECE]
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


def saw(m, t0, d, a=.03, pan=0, cut=2500):
    t = np.arange(int(d*SR))/SR; s = 2*((hz(m)*t) % 1)-1; s = sosfilt(butter(2, cut, fs=SR, output='sos'), s)
    put(a*s*np.minimum(1, t/.01)*np.minimum(1, (d-t)/.03), t0, pan)
def brass(ms, t0, d, a=.03, pan=0):
    for m in ms: saw(m, t0, d, a/len(ms)*1.6, pan, 1800)
def timp(t0, m=40, a=.16):
    t = np.arange(int(.9*SR))/SR; put(a*np.sin(2*np.pi*hz(m)*t*(1+.1*np.exp(-t*20)))*np.exp(-t*4), t0)
def cricket(t0, a=.012):
    for k in range(3):
        t = np.arange(int(.03*SR))/SR; put(a*np.sin(2*np.pi*4300*t)*np.sin(np.pi*t/.03), t0 + k*.05, .5)
def strum(ms, t0, a=.03, down=True, pan=-.2):
    for j, m in enumerate(ms if down else ms[::-1]): put(pluck(m, a, .5, 1.6), t0 + j*.012, pan)
def bar_loop(T0, T1, B, n, fn):
    t = T0; bar = 0
    while t < T1 - .15:
        fn(t, bar); t += n*B; bar += 1

if PIECE == 'caso04':
    B = 60/150; T = 27.4; ch = [[52, 55, 59], [48, 52, 55], [50, 54, 57], [47, 50, 54]]   # Em C D B
    def f(t, bar):
        c = ch[bar % 4]
        for b in range(4):
            x = t + b*B
            if x >= T-.15: break
            thump(x, .15 if b % 2 == 0 else .08); hat(x + B/2, .02)
            if b % 2: snare(x, .06)
            subbass(c[0]-12, x, B*.9, .12)
        for k in range(16):
            x = t + k*B/4
            if x >= T-.15: break
            put(pluck(c[k % 3]+24, .028, .12, 2.0), x, .25)                       # trémolo de guitarra
    bar_loop(0, T, B, 4, f)
    for i in range(5): put(bell(88, .04, .25), .4 + i*.55, .3)
    for x in (4.4, 5.6, 16.0, 18.2): put(bell(86, .04, .3), x, .3)
    glide(15.5, 220, 120, 1.2, .05)                                                   # frenazo suave
    for i in range(3): pop(21.8 + i*.3, .06)
    swoosh(T-.4, .5, .12); outro(T, 40)
elif PIECE == 'cap12':
    B = 60/200; T = 25.4; ch = [[55, 58, 62], [50, 53, 57], [57, 61, 64, 67], [50, 53, 57]]   # Gm Dm A7 Dm
    def f(t, bar):
        c = ch[bar % 4]
        for b in range(4):
            x = t + b*B
            if x >= T-.15: break
            if b % 2 == 0: subbass(c[0]-12 + (7 if b == 2 else 0), x, B*.8, .1)
            else: strum([m+12 for m in c], x, .03)                                    # la pompe
            if b % 2 == 0: strum([m+12 for m in c], x, .015)
    bar_loop(0, T, B, 4, f)
    mel = [74, 77, 81, 79, 77, 74, 73, 74, 77, 76, 74, 72, 70, 69, 70, 74]
    for i in range(30):
        x = 4.0 + i*B*1.5
        if x > T-.5: break
        bando(mel[i % 16]+12, x, B*1.2, .022, .2)
    glide(2.0, 300, 900, .3, .05)
    for i in range(4): pop(4.4 + i*.6, .06); put(bell(84 + i*3, .03, .3), 4.4 + i*.6)
    for x in (9.4, 10.2, 11.2, 12.0): put(bell(88, .04, .25), x, .3)
    noise(14.2, 1.2, 2000, 8000, .03, .2, 3)                                         # chisporroteo
    for i in range(3): put(marimba(84, .07, .25), 20.8 + i*.6)
    click(21.2, .06, 900); glide(21.4, 500, 900, .15, .05)
    swoosh(T-.4, .5, .12); outro(T, 50)
elif PIECE == 'barrio04':
    B = 60/160; T = 25.4; ch = [[48, 52, 55], [53, 57, 60], [55, 59, 62], [48, 52, 55]]   # C F G C
    def f(t, bar):
        c = ch[bar % 4]
        for b in range(4):
            x = t + b*B
            if x >= T-.15: break
            subbass(c[(b) % 3]-12, x, B*.8, .11)                                    # bajo caminante
            strum([m+12 for m in c], x + B/2, .03)                                  # skank a contratiempo
            thump(x, .14 if b in (0, 2) else .05); 
            if b in (1, 3): snare(x, .05)
        if bar % 2 == 1: brass([c[0]+12, c[1]+12, c[2]+12], t + 3*B, B*.4, .05, .1); brass([c[0]+12, c[1]+12, c[2]+12], t + 3.5*B, B*.4, .05, .1)
    bar_loop(0, T, B, 4, f)
    for i in range(12): glide(.3 + i*.28, 900, 1400, .2, .02)                     # aviones
    for i in range(3): put(bell(84, .04, .3), 4.4 + i*.3)
    glide(8.8, 200, 400, 1.8, .04); click(10.6, .05, 700); click(13.6, .05, 700); click(16.6, .05, 700)  # ascensor
    for a in (11.0, 14.0, 17.0): pop(a, .06); put(bell(88, .04, .3), a+1.2)
    brass([72, 76, 79], 20.0, .5, .07); brass([74, 77, 81], 20.5, .8, .07)
    swoosh(T-.4, .5, .12); outro(T, 48)
elif PIECE == 'cap13':
    B = 60/120; T = 25.4; ch = [[46, 50, 53], [53, 57, 60], [46, 50, 53], [41, 45, 48]]   # Bb F Bb F
    def f(t, bar):
        c = ch[bar % 4]
        for b in range(4):
            x = t + b*B
            if x >= T-.15: break
            if b in (0, 2): timp(x, c[0]-12, .12)
            noise(x + B/2, .12, 4000, 12000, .02, .3, 6)                             # platillos
            brass([c[1]+12, c[2]+12], x + B/2, B*.3, .035, -.1)
        brass([c[0]+24], t, B*1.8, .03, .2)
    bar_loop(0, T, B, 4, f)
    for i in range(30):
        x = .4 + i*.6
        if x > T: break
        click(x, .01, 3000)
    for a in (4, 8, 12, 16):
        click(a+1.8, .06, 1200); put(bell(84, .05, .3), a+1.9); put(bell(91, .04, .4), a+2.7)
        noise(a+2.0, .8, 600, 3000, .03, -.3, 3)                                    # público
    brass([70, 74, 77, 82], 20.0, 1.2, .08)
    swoosh(T-.4, .5, .12); outro(T, 46)
elif PIECE == 'news03':
    B = 60/120; T = 23.4; ch = [[50, 53, 57], [46, 50, 53], [48, 52, 55], [45, 49, 52]]   # Dm Bb C A
    timp(.1, 38, .2); brass([62, 65, 69], .1, .6, .07); brass([62, 65, 69], .9, .25, .06); brass([64, 67, 70], 1.2, 1.0, .06)
    def f(t, bar):
        c = ch[bar % 4]
        for k in range(8):
            x = t + k*B/2
            if x >= T-.15: break
            put(pluck(c[k % 3]+12, .025, .18, 2.0), x, .2)                           # pulso
        thump(t, .14); thump(t + 2*B, .12); hat(t + B, .02); hat(t + 3*B, .02)
        subbass(c[0]-12, t, 4*B*.9, .09)
    bar_loop(2.0, T, B, 4, f)
    for a in (4.0, 9.0, 14.0, 18.5): timp(a, 38, .14); brass([62, 65, 69], a, .3, .05)
    for i in range(3): put(bell(86, .05, .5), 4.4 + i*.9)
    put(bell(93, .06, .9), 9.4); glide(10.8, 900, 500, .5, .04)
    for i in range(3): put(marimba(84, .07, .25), 19.4 + i*.6)
    swoosh(T-.4, .5, .12); outro(T, 50)
elif PIECE == 'barrio05':
    T = 25.4
    mb = [79, 76, 72, 76, 79, 84, 83, 79, 77, 74, 71, 74, 77, 81, 79, 76]
    for i in range(30):
        x = .3 + i*.55
        if x > 17.0: break
        put(bell(mb[i % 16], .035, 1.2), x, .2*np.sin(i))
        if i % 3 == 0: put(bell(mb[i % 16]-24, .03, 1.6), x, -.2)
    R2 = np.random.default_rng(5)
    rain = sosfilt(butter(2, [1500, 9000], btype='band', fs=SR, output='sos'), R2.standard_normal(int(18*SR)))
    env = np.minimum(1, np.arange(len(rain))/SR/1.0)*np.clip((18 - np.arange(len(rain))/SR)/2.0, 0, 1)
    put(.012*rain/np.max(np.abs(rain))*env, 0, 0)
    for i in range(14): put(bell(88, .03, .2), 9.3 + i*.55, .4)
    B = 60/110; chp = [[55, 59, 62], [50, 54, 57], [52, 55, 59], [48, 52, 55]]
    def f(t, bar):
        c = chp[bar % 4]
        for b in range(4):
            x = t + b*B
            if x >= T-.15: break
            strum([m+12 for m in c], x, .03, b % 2 == 0); strum([m+12 for m in c], x + B/2, .018, False)
            thump(x, .12 if b % 2 == 0 else .05)
            if b % 2: snare(x, .04)
        subbass(c[0]-12, t, 4*B*.9, .1)
    bar_loop(17.0, T, B, 4, f)
    for j, m in enumerate([67, 71, 74, 79]): put(bell(m+12, .05, .9), 17.0 + j*.1)
    swoosh(T-.4, .5, .12); outro(T, 43)
elif PIECE == 'cap14':
    B = 60/130; T = 25.4; ch = [[55, 59, 62], [48, 52, 55], [50, 54, 57], [55, 59, 62]]   # G C D G
    def f(t, bar):
        c = ch[bar % 4]
        roll = [c[0]+12, c[1]+12, c[2]+12, c[0]+24, c[2]+12, c[1]+12, c[0]+24, c[2]+12]
        for k in range(8):
            x = t + k*B/2
            if x >= T-.15: break
            put(pluck(roll[k], .035, .25, 3.0), x, .3)                                # banjo
        for b in range(4):
            x = t + b*B
            if x >= T-.15: break
            subbass((c[0] if b % 2 == 0 else c[0]+7)-12, x, B*.6, .11)
            if b % 2: put(pluck(c[1], .03, .1, 1.4), x, -.25)
    bar_loop(0, T, B, 4, f)
    noise(1.6, 2.4, 600, 3000, .03, 0, 1)                                            # papel que se desenrolla
    for x in (8.7, 9.0, 9.3): click(x, .07, 2400)                                   # tijeras
    for a in (9.3, 14.3, 17.3): pop(a, .06)
    for i in range(3): glide(20.0 + i*.2, 800, 300, .5, .03)
    thump(21.4, .1)
    swoosh(T-.4, .5, .12); outro(T, 43)
elif PIECE == 'cuida01':
    B = 60/92; T = 25.4; ch = [[45, 48, 52, 55], [50, 53, 57, 60], [44, 47, 50, 53], [45, 48, 52, 55]]   # Am7 Dm7 E7b9 Am7
    for i in range(int(T/.9)): cricket(.2 + i*.9 + .1*np.sin(i), .01)
    def f(t, bar):
        c = ch[bar % 4]
        walk = [c[0]-12, c[2]-12, c[1]-12, c[3]-12]
        for b in range(4):
            x = t + b*B
            if x >= T-.15: break
            put(pluck(walk[b], .09, .5, .7), x)                                    # contrabajo pizzicato
            noise(x, .1, 3000, 9000, .012, .3, 5); noise(x + B*.66, .06, 3000, 9000, .008, .3, 6)   # escobillas
        for j, m in enumerate(c): put(bell(m+12, .02, 1.6), t + j*.02, -.1)           # vibráfono
    bar_loop(0, T, B, 4, f)
    for x in (7.2,): click(x, .08, 1500); click(x+.06, .06, 1100)                  # se abre la primera llave
    for i in range(6): click(10.8 + i*.18, .04, 2000)                                # teclado
    glide(11.6, 300, 180, .5, .05); glide(12.6, 300, 180, .5, .05)
    put(bell(91, .05, .4), 9.8); put(bell(96, .04, .3), 10.0)
    noise(13.7, .5, 1500, 7000, .04, -.3, 4)                                         # ¡fff!
    for j, m in enumerate([69, 72, 76, 81]): put(bell(m+12, .05, .9), 15.4 + j*.08)
    for i in range(4): pop(19.2 + i*.4, .06)
    swoosh(T-.4, .5, .12); outro(T, 45)

def ir(seed, secs=1.4):
    g = np.random.default_rng(seed); t = np.arange(int(secs*SR))/SR
    x = g.standard_normal(len(t))*np.exp(-t*4); x = sosfilt(butter(1, 6000, fs=SR, output='sos'), x); return x/np.sqrt(np.sum(x**2))
oL = L*.88 + fftconvolve(L, ir(12))[:N]*.25; oR = R*.88 + fftconvolve(R, ir(13))[:N]*.25
fade = np.ones(N); fo = int((DUR-1.0)*SR); fade[fo:] = np.linspace(1, 0, N-fo)**1.5
out = np.stack([oL*fade, oR*fade], 1); out *= .89/np.max(np.abs(out))
wavfile.write(f'audio_{PIECE}.wav', SR, (out*32767).astype(np.int16)); print('ok', PIECE)
