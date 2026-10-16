# Uso (desde design/motion): VH=<alto> python3 render.py <story|cap04|reel> <inicio> <fin> <carpeta>  → cuadros JPG
#           VH=<alto> python3 render.py <función> sheet 1,2.5,4  → hoja de contacto <función>_sheet.png
import os, sys, time
from playwright.sync_api import sync_playwright
fn=sys.argv[1]; FPS=30; times=None
if sys.argv[2]=='sheet':
    times=[float(x) for x in sys.argv[3].split(',')]
else:
    start,end=float(sys.argv[2]),float(sys.argv[3]); out=sys.argv[4]; os.makedirs(out,exist_ok=True)
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1080,'height':int(os.environ.get('VH','1920'))})
    pg.goto('file://'+os.getcwd()+'/engine.html'); pg.evaluate('window.ready')
    if times:
        from PIL import Image; import io
        w,h=216,int(216*int(os.environ.get('VH','1920'))/1080); cols=8; rows=(len(times)+cols-1)//cols
        sheet=Image.new('RGB',(cols*(w+8),rows*(h+30)),'white')
        from PIL import ImageDraw; d=ImageDraw.Draw(sheet)
        for k,t in enumerate(times):
            pg.evaluate(f"{fn}({t})"); im=Image.open(io.BytesIO(pg.screenshot(type='jpeg',quality=85))).resize((w,h))
            x,y=(k%cols)*(w+8),(k//cols)*(h+30); sheet.paste(im,(x,y)); d.text((x+4,y+h+6),f"{t}s",fill=(0,0,0))
        sheet.save(f'{fn}_sheet.png')
    else:
        t0=time.time()
        for i in range(int(start*FPS),int(end*FPS)):
            pg.evaluate(f"{fn}({i/FPS})"); pg.screenshot(path=f'{out}/f{i:05d}.jpg',type='jpeg',quality=95)
        print('done',round(time.time()-t0,1))
    b.close()
