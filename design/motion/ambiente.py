"""Ambiente sonoro para los casos v2: pájaros (clínica, mañana) y grillos (automotora, noche),
más un 'mrrp' de gato y un 'buf' de perro cuando despiertan. Se mezcla bajo la música."""
import numpy as np, sys
from scipy.io import wavfile
from scipy.signal import butter, sosfilt
SR=48000; N=int(34.5*SR); L=np.zeros(N); R=np.zeros(N); rng=np.random.default_rng(4)
def put(s,t0,pan=0.):
    i=int(t0*SR); s=s[:N-i]; L[i:i+len(s)]+=s*np.cos((pan+1)*np.pi/4); R[i:i+len(s)]+=s*np.sin((pan+1)*np.pi/4)
def chirp(t0,f0,f1,d=.07,a=.05,pan=0):
    t=np.arange(int(d*SR))/SR; f=np.linspace(f0,f1,len(t)); put(a*np.sin(2*np.pi*np.cumsum(f)/SR)*np.sin(np.pi*t/d)**2,t0,pan)
def bird(t0,pan):
    n=rng.integers(2,5); base=rng.uniform(2600,3600)
    for k in range(n): chirp(t0+k*.11,base,base*rng.uniform(1.3,1.6),.06+.02*rng.random(),.035,pan)
def crickets(t0,t1,a=.012):
    t=np.arange(int((t1-t0)*SR))/SR; car=np.sin(2*np.pi*4400*t); am=(np.sin(2*np.pi*28*t)>0.2).astype(float)
    gate=((t%0.62)<0.26).astype(float); env=np.minimum(1,np.minimum(t,(t1-t0)-t)/.4)
    put(a*car*am*gate*env,t0,.3); put(.7*a*np.sin(2*np.pi*4700*t)*am*np.roll(gate,int(.3*SR))*env,t0,-.4)
def mrrp(t0):
    t=np.arange(int(.32*SR))/SR; f=520+300*np.sin(np.pi*t/.32)+12*np.sin(2*np.pi*7*t)
    s=sum(np.sin(2*np.pi*np.cumsum(f)*h/SR)/h**1.5 for h in range(1,5)); put(.05*s*np.sin(np.pi*t/.32)**1.5,t0,-.3)
def boof(t0,a=.09):
    t=np.arange(int(.16*SR))/SR; f=330*np.exp(-t*4); n=sosfilt(butter(2,[200,1200],btype='band',fs=SR,output='sos'),rng.standard_normal(len(t)))
    put(a*(np.sin(2*np.pi*np.cumsum(f)/SR)+.4*n/np.max(np.abs(n)))*np.exp(-t*14),t0,-.3)
k=sys.argv[1]
if k=='clinica':
    for t0 in [.3,1.2,2.9,3.8,4.7]: bird(t0,rng.uniform(-.6,.6))
    for t0 in np.arange(16.2,28,1.6): bird(t0+rng.uniform(0,.5),rng.uniform(-.6,.6))
    mrrp(2.0); mrrp(11.3)
else:
    crickets(0,5.6,.014); crickets(5.6,15.6,.006); crickets(28.4,34.5,.012)
    pass
out=np.stack([L,R],1); wavfile.write(f'amb_{k}.wav',SR,(np.clip(out,-1,1)*32767).astype(np.int16)); print('ok',k)
