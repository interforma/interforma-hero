import sys,os
from playwright.sync_api import sync_playwright
fn,t,out=sys.argv[1],sys.argv[2],sys.argv[3]
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page(viewport={'width':1080,'height':1920})
    pg.goto('file://'+os.getcwd()+'/engine.html');pg.evaluate('window.ready');pg.evaluate(f"{fn}({t})");pg.screenshot(path=out);b.close()
