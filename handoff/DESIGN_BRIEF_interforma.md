# Brief de rediseño visual — interforma.digital
Dirección: "Opción B — línea Cal.com" (aprobada por el cliente)

## Objetivo
Aplicar un nuevo sistema visual al sitio existente (blanco / negro / gris, tipografía bold,
componentes redondeados estilo Cal.com) **sin tocar la estructura de contenido, SEO, GEO,
analítica ni tracking ya implementados.**

Referencia visual adjunta: `moodboard-calcom.html` (ábrelo en el navegador para verlo).
No es código para copiar/pegar — es la referencia de estilo. La implementación real debe
integrarse a los componentes y al framework que ya usa el sitio (Astro).

También se adjunta la carpeta `referencias-calcom/` con 5 capturas reales de cal.com/es
(hero con widget de reserva, grid de features, FAQ, testimonios + integraciones, y el
segundo grid de features). Claude Code puede leer imágenes directamente — pídele que las
abra y las compare con `moodboard-calcom.html` para confirmar que entendió bien el lenguaje
visual (esquinas redondeadas, badges con puntos de esquina, tipografía bold, tarjetas sobre
fondo gris) antes de tocar el código del sitio real.

Por referencia histórica también se incluye `moodboard-opcionA-marfil-pixelart.html`
(la primera dirección explorada, ya descartada a favor de la Opción B) — no es necesario
usarla, solo se deja por si se quiere rescatar algún detalle puntual más adelante.

---

## 1. Qué NO debe tocarse (alto riesgo si se rompe)
- Meta tags de SEO (`title`, `description`, `og:*`, `canonical`, `hreflang` si existe).
- Datos estructurados / JSON-LD (schema.org) usados para GEO.
- Scripts de analítica y tracking: Google Analytics/GTM, Microsoft Clarity, Meta Pixel, etc.
  — no mover, no eliminar, no re-envolver en componentes nuevos sin verificar que sigan
  disparando en el `<head>` o donde corresponda.
- URLs, slugs, anclas (`#inicio`, `#problemas`, `#metodo`, `#contacto`) y la jerarquía de
  encabezados (`h1`, `h2`, `h3`) — son parte del SEO on-page, no reordenar ni fusionar.
- Copys ya optimizados para SEO/GEO (a menos que se pida explícitamente ajustarlos).

**Antes de tocar nada**, pídele a Claude Code que liste dónde están estos elementos en el
proyecto (archivo de tracking, componente de `<head>`, etc.) para confirmar que los identificó
correctamente antes de tocar cualquier layout.

## 2. Qué SÍ cambia (sistema visual)

### Color
| Token | Valor | Uso |
|---|---|---|
| `--white` | `#FFFFFF` | fondo base |
| `--gray-50` | `#F6F6F5` | fondo de secciones alternas, badges de ícono |
| `--gray-100` | `#EFEFED` | bordes suaves, separadores |
| `--gray-200` | `#E3E3E0` | bordes de tarjetas/botones outline |
| `--gray-400` | `#9C9C97` | detalles decorativos (puntos de esquina) |
| `--gray-500` | `#6E6E68` | texto secundario |
| `--ink` | `#111110` | texto principal, botones sólidos, fondo CTA final |

Sin acento de color por ahora (pendiente decidir si se reintroduce un acento de marca —
ver nota al final).

### Tipografía
- Títulos: **Plus Jakarta Sans**, peso 700–800.
- Cuerpo/UI: **Inter**, peso 400–600.
- Mantener el `h1` de cada página tal cual está en contenido/SEO; solo cambia su estilo
  visual (fuente, peso, tamaño), no su texto ni su nivel jerárquico.

### Radios y sombras
- Botones: `border-radius: 11px`.
- Tarjetas: `border-radius: 16–20px`.
- CTA final (bloque oscuro): `border-radius: 28px`.
- Sombra de tarjetas: suave y difusa, no dura (`box-shadow` grande, opacidad baja).

### Componentes clave a replicar
1. **Botón sólido**: fondo `--ink`, texto blanco, radio 11px.
   **Botón outline**: fondo blanco, borde `--gray-200`, mismo radio.
2. **Badge de ícono**: cuadrado `44x44px`, fondo `--gray-50`, borde `--gray-200`, radio 13px,
   con 4 puntos decorativos de 3px en las esquinas (detalle "tipo tornillo" característico
   de Cal.com) e ícono de línea simple (trazo negro, sin relleno) centrado.
3. **Tarjeta de vista previa ("widget")** en el hero: tarjeta blanca con borde y sombra,
   dividida en dos columnas — datos de la sesión (avatar, título, duración, ubicación) a la
   izquierda, mini calendario a la derecha. Ver `moodboard-calcom.html` para la estructura.
4. **Sección con marcas "+" en las esquinas**: usar en secciones de fondo gris como guiño
   de grid, igual que en el archivo de referencia.
5. **Grid de 6 tarjetas** (contenido de "Problemas") sobre fondo gris, tarjetas blancas.
6. **Bloque CTA final**: fondo negro sólido, esquinas muy redondeadas, botón blanco + botón
   outline claro.

## 3. Cómo pedírselo a Claude Code (sugerencia de flujo)
1. Trabajar en una rama nueva, no directo sobre main/producción.
2. Pedirle primero que **audite el proyecto** y liste: dónde están los scripts de analítica/
   Clarity, dónde están los meta tags de SEO/GEO, y qué componentes existen para header,
   hero, tarjetas y footer. Confirmar ese mapa antes de tocar código.
3. Pedirle que cree un archivo de **tokens de diseño** (variables CSS o `tailwind.config`,
   según lo que use el proyecto) con los valores de la tabla de arriba, en vez de estilos
   sueltos repartidos por componente.
4. Aplicar el rediseño **componente por componente** (botones → badges/íconos → tarjetas →
   hero → CTA final), pidiendo una captura o preview después de cada paso, no todo de una vez.
5. Pedir explícitamente: "no modifiques el contenido de texto, los meta tags, el schema ni
   los scripts de tracking — solo el CSS/estructura visual de los componentes."
6. Antes de mergear: comparar visualmente antes/después y confirmar que Clarity/Analytics
   sigan cargando (ver la pestaña de red o el panel de Clarity mostrando sesiones nuevas).

## 4. Prompt sugerido para pegar en Claude Code

> Quiero aplicar un rediseño visual a interforma.digital manteniendo intacto todo el SEO,
> GEO, datos estructurados y scripts de analítica/Clarity ya implementados — solo cambia el
> sistema visual (color, tipografía, componentes), no el contenido ni el tracking.
>
> Antes de tocar nada: revisa el proyecto y dime dónde están los scripts de analítica/Clarity,
> los meta tags de SEO y los datos estructurados, para confirmar que no se van a tocar.
>
> Luego, trabajando en una rama nueva, crea un archivo de tokens de diseño con esta paleta,
> tipografía y radios: [pegar la tabla de la sección 2 de este documento]. Aplícalo
> componente por componente (botones, badges de ícono, tarjetas, hero, CTA final), mostrándome
> una captura después de cada componente antes de seguir con el siguiente. Adjunto
> `moodboard-calcom.html` y la carpeta `referencias-calcom/` (capturas reales de cal.com/es)
> como referencia visual del resultado esperado — revísalas antes de empezar.

---

## Nota pendiente
El cliente todavía no decide si quiere 100% blanco/negro/gris (fiel a Cal.com) o si prefiere
reservar un color de acento propio de marca para botones/detalles. Confirmar esto antes de
implementar en producción, ya que cambia el token de color principal.
