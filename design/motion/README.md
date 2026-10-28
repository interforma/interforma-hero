# Animaciones de marca (motion)

Fuentes de las piezas animadas de Interforma: Punto, «La semilla», la presentación de Punto y la plantilla de capítulos (Cap. 04). Reglas de uso en el design system, sección «Punto y movimiento», y en `DESIGN.md`.

Todo se dibuja con código: `engine.html` contiene un motor SVG que dibuja cualquier cuadro a partir del tiempo `t`. Playwright captura los cuadros, ffmpeg arma el video y dos scripts en Python componen la música original.

| Archivo | Qué hace |
| --- | --- |
| `engine.html` | Motor de dibujo SVG. Cada función dibuja un cuadro a partir del tiempo `t` (ver tabla de piezas) |
| `render.py` | `VH=<alto> python3 render.py <función> <inicio> <fin> <carpeta>` captura cuadros JPG a 30 fps; `... <función> sheet t1,t2,...` arma una hoja de contacto |
| `cuadro.py` | `python3 cuadro.py <función> <t> <salida.png>`: un cuadro suelto a resolución completa |
| `musica.py` | Música de «La semilla» (50 s, re mayor) |
| `audio_cap04.py` | Música y efectos del Cap. 04 (25 s, 112 bpm). Sus primeras 67 líneas son la caja de herramientas de síntesis que reutilizan los demás |
| `audio_casos.py` | Música de los casos «Punto en acción» (`python3 audio_casos.py clinica\|automotora`, 34,5 s) |
| `ambiente.py` | Sonido ambiente de las versiones con escenario: pájaros y gato (clínica), grillos (automotora) |
| `audio_metodo.py` | Método Interforma: lo-fi por capas a 96 bpm, sube de Fa a Sol en la etapa 6 (48 s) |
| `audio_reel03.py` | Cap. 03: rasgueo tipo ukelele, silbido y palmas a 104 bpm (18 s) |
| `audio_reel05.py` | Cap. 05: latido tenso que se vuelve bossa a 112 bpm (23 s) |
| `audio_cap04v2.py` | Cap. 04 v2: swing jazzero a 126 bpm con vibráfono y trompeta con sordina (27 s) |
| `audio_rosa01.py` | El barrio de Punto · Ep. 01: acordeón de noche que se vuelve cumbia suave a 100 bpm (28 s) |
| `audio_problemas.py` | «¿Le suena familiar?»: lo-fi en re menor a 96 bpm que resuelve a fa mayor en el cierre (34,7 s); efectos con la misma lista de eventos que el sitio |
| `render_problemas.mjs` | Renderiza el reel «¿Le suena familiar?» desde el componente real del sitio (ver abajo) |
| `stickers.py` | Genera los 6 stickers WebP de WhatsApp |
| `fonts/` | Outfit, Manrope y JetBrains Mono (licencia OFL), versionadas para que cualquier sesión pueda renderizar |
| `../../scripts/isotipo-gif.py` | GIF del isotipo para la firma de correo |

### Piezas en `engine.html`

| Función | Pieza | Formato |
| --- | --- | --- |
| `story(t)` | Cap. 01 · La semilla (raíces v2) | 1080×1920, 50 s |
| `reel(t)` | Presentación de Punto | 1080×1920, 15 s |
| `cap04(t)` | Cap. 04 · ¿Qué es un agente de IA? (v1, plana) | 1080×1350, 25 s |
| `cap04v2(t)` | Cap. 04 v2 · «Hoy llega alguien nuevo al equipo»: recorrido con paneo por la oficina, ventanas con parallax al 40 %, plantas en primer plano al 130 %, Punto con credencial, el gato y Carla | 1080×1920, 27 s |
| `metodo(t)` | El Método Interforma: 6 etapas, 6 emociones | 1080×1920, 48 s |
| `clinica(t)` / `automotora(t)` | Punto en acción, versión plana | 1080×1920, 34,5 s |
| `clinica2(t)` / `automotora2(t)` | Punto en acción con escenarios del barrio (recepción con el gato, patio de autos de noche) | 1080×1920, 34,5 s |
| `reel03(t)` | Cap. 03 · ¿En cuántas planillas vive tu cliente? | 1080×1920, 18 s |
| `reel05(t)` | Cap. 05 · El mito: «La IA va a reemplazar a mi equipo» (oficina con equipo y el gato) | 1080×1920, 23 s |
| `rosa01(t)` | El barrio de Punto · Ep. 01: Doña Rosa y los 40 audios (ferretería, Doña Rosa, el gato) | 1080×1920, 28 s |
| `portada(k)`, `portadaCliSq()`, `post03()` | Portadas de grilla e imagen fija del Cap. 03 | — |
| `sticker(nombre, p)` | Stickers de Punto | 512×512 |

### El barrio de Punto (escenarios)

Desde octubre de 2026 las piezas viven en «El barrio de Punto»: fondos con profundidad en capas (cielo → cerros lejanos más claros → cerros medios → objetos), interiores (recepción, oficina, sala de ventas) y exteriores (barrio, patio de noche). Las piezas reutilizables están en el bloque `escenas` de `engine.html`:

- Paisaje: `hill`, `tree`, `house`, `car`, `lamp`, `stars`, `moon`, `birds`, `dayWindow`, `nightWindow`, `plant`, `clock`.
- Doña Rosa (ferretería): `rosa(x, y, escala, ánimo, t)` con ánimos `tired`, `ok`, `happy` y `surprised`, más `rosaArms` para brazos y teléfono. La ferretería usa `shelves`.
- El gato del barrio (personaje fijo): `catLying` (duerme y despierta), `catSit`, `catWalk`. El perro se descartó en la revisión del 26/10.
- Degradados y recortes: `lgrad`, `rgrad`, `clip` (llenan `DEFS`; cada función de pieza parte con `DEFS='';GID=0` y termina con `<defs>${DEFS}</defs>`).
- Paleta de naturaleza, siempre apagada para no competir con Energía: `SAGE`, `SAGE2`, `SAGE_L`, `GROUND_L`, `HILL_C`, `WOOD`, y de noche `NIGHT1..3`.

### «¿Le suena familiar?» (sitio + reel)

Esta pieza no vive en `engine.html`: es el componente `src/sections/ProblemsSection.astro`, el mismo que se ve en el home. Así el sitio y el reel nunca se desfasan.

- En escritorio se ve horizontal (800×460); en móvil, vertical (450×640).
- Con `?ps-render=reel` pasa a 9:16 con título, subtítulo de cada problema y la marca al cierre, y expone `window.psRender(t)` para dibujar cualquier instante.
- Duración de las escenas: `DUR` del componente. Efectos de sonido: `EVENTS` del componente, repetidos en `audio_problemas.py`. Si cambia uno, se cambia el otro.

```bash
pnpm build && python3 -m http.server 4321 --directory dist &   # sitio local
cd design/motion
npm i playwright && npx playwright install chromium            # una vez
node render_problemas.mjs http://localhost:4321 sheet out/revision   # 14 cuadros para revisar
node render_problemas.mjs http://localhost:4321 frames out/problemas
python3 audio_problemas.py
ffmpeg -y -i audio_problemas.wav -af loudnorm=I=-14:TP=-1.5:LRA=11 audio-norm.wav
ffmpeg -y -framerate 30 -i out/problemas/f%05d.jpg -i audio-norm.wav -map 0:v -map 1:a \
  -c:v libx264 -crf 18 -preset veryfast -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart le-suena-familiar.mp4
```

## Preparar (una vez)

```bash
cd design/motion
pip install playwright pillow numpy scipy && python3 -m playwright install chromium
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

## Flujo semanal

Cada domingo se producen las cinco publicaciones de lunes a viernes a partir del calendario de RRSS en Notion. Los videos y portadas quedan en Google Drive y la ficha de Notion pasa a «Revisión». Sergio revisa, pide cambios si hace falta y publica. Todas las piezas son reels 9:16 con música original y sonido ambiente cuando hay escenario.

Para una pieza nueva: copia la función más parecida, revisa con una hoja de contacto, renderiza, compón la música con una copia del script de audio más parecido (manteniendo los tiempos de los efectos), normaliza a -14 LUFS y une con ffmpeg.

`out/` y los `.wav` no se versionan.
