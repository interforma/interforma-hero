# Animaciones de marca (motion)

Fuentes de las piezas animadas de Interforma: Punto, «La semilla», la presentación de Punto y la plantilla de capítulos (Cap. 04). Reglas de uso en el design system, sección «Punto y movimiento», y en `DESIGN.md`.

Todo se dibuja con código: `engine.html` contiene un motor SVG que dibuja cualquier cuadro a partir del tiempo `t`. Playwright captura los cuadros, ffmpeg arma el video y dos scripts en Python componen la música original.

| Archivo | Qué hace |
| --- | --- |
| `engine.html` | Motor de dibujo. Funciones: `story(t)` La semilla (1080×1920, 50 s) · `reel(t)` presentación de Punto (1080×1920, 15 s) · `cap04(t)` Cap. 04 (1080×1350, 25 s) · `sticker(nombre, p)` stickers |
| `render.py` | Captura cuadros JPG o una hoja de contacto para revisar |
| `stickers.py` | Genera los 6 stickers WebP de WhatsApp |
| `musica.py` | Música de «La semilla» (50 s, re mayor) |
| `audio_cap04.py` | Música y efectos del Cap. 04 (25 s, 112 bpm) |
| `../../scripts/isotipo-gif.py` | GIF del isotipo para la firma de correo |

## Preparar (una vez)

```bash
cd design/motion
pip install playwright pillow numpy scipy && python3 -m playwright install chromium
mkdir -p fonts
cp ../../node_modules/@fontsource-variable/outfit/files/outfit-latin-wght-normal.woff2 fonts/
cp ../../node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2 fonts/
cp ../../node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2 fonts/
```

## Regenerar una pieza

```bash
# La semilla con música
VH=1920 python3 render.py story 0 50 out/semilla
python3 musica.py
ffmpeg -y -i musica-la-semilla.wav -af loudnorm=I=-14:TP=-1.5:LRA=11 musica-norm.wav
ffmpeg -y -framerate 30 -i out/semilla/f%05d.jpg -i musica-norm.wav -map 0:v -map 1:a \
  -c:v libx264 -crf 17 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart la-semilla.mp4

# Cap. 04 con música
VH=1350 python3 render.py cap04 0 25 out/cap04
python3 audio_cap04.py
ffmpeg -y -i audio_cap04.wav -af loudnorm=I=-14:TP=-1.5:LRA=11 audio-norm.wav
ffmpeg -y -framerate 30 -i out/cap04/f%05d.jpg -i audio-norm.wav -map 0:v -map 1:a \
  -c:v libx264 -crf 17 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart cap04.mp4
```

Antes de renderizar todo, revisa con una hoja de contacto: `VH=1350 python3 render.py cap04 sheet 1,5,10,15,20,24`.

## Hacer un capítulo nuevo

Copia la función `cap04` en `engine.html` y cambia textos, expresiones de Punto y tiempos. Mantén la estructura de la serie: portada en Umbra con chip «CAP. NN · PILAR» → barrido Energía → tres viñetas numeradas → barrido Umbra → cierre con la idea fuerza y el adelanto del capítulo siguiente. Si cambian los tiempos, ajusta los efectos en una copia de `audio_cap04.py`.

`out/`, `fonts/` y los `.wav` no se versionan.
