---
name: Interforma
description: Consultora digital chilena — transformación con método, no con promesas
version: Identidad 2026 (oct. 2026, ADR-009)
colors:
  energia: "#EE6E43"
  energia-400: "#F2906D"
  energia-600: "#D9582E"
  energia-800: "#9A3D1A"
  energia-900: "#7A2F13"
  energia-50: "#FBE6DC"
  energia-100: "#F7CDBB"
  umbra: "#281F18"
  papel: "#F2F1EE"
  piedra-clara: "#E4E3DF"
  piedra: "#BEB8AE"
  piedra-500: "#8F887E"
  piedra-700: "#5C564E"
  borde: "#D0CCC4"
  cielo: "#CCE2ED"
  ok: "#18794E"
  alerta: "#A35200"
  error: "#C53030"
  whatsapp-green: "#25D366"
typography:
  display:
    fontFamily: "'Outfit Variable', 'Outfit', system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 6.5vw, 5.25rem)"
    fontWeight: 500
    lineHeight: 1.02
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "'Outfit Variable', 'Outfit', system-ui, sans-serif"
    fontSize: "2rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title:
    fontFamily: "'Outfit Variable', 'Outfit', system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 500
    lineHeight: 1.25
  body:
    fontFamily: "'Manrope Variable', 'Manrope', system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "'Manrope Variable', 'Manrope', system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.08em"
  data:
    fontFamily: "'JetBrains Mono', ui-monospace, monospace"
    fontWeight: 400
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  btn: "11px"
  card: "16px"
  card-lg: "20px"
  cta: "28px"
  full: "9999px"
spacing:
  1: "4px"
  2: "8px"
  3: "12px"
  4: "16px"
  5: "20px"
  6: "24px"
  8: "32px"
  10: "40px"
  12: "48px"
  16: "64px"
  20: "80px"
components:
  button-primary:
    backgroundColor: "{colors.energia}"
    textColor: "{colors.umbra}"
    rounded: "{rounded.btn}"
  button-primary-hover:
    backgroundColor: "{colors.energia-400}"
  button-on-energia:
    backgroundColor: "{colors.umbra}"
    textColor: "{colors.papel}"
    rounded: "{rounded.btn}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.umbra}"
    borderColor: "{colors.umbra}"
    rounded: "{rounded.btn}"
  focus-ring:
    color: "{colors.energia-800}"
    width: "2px"
    offset: "2px"
---

# Design System: Interforma

**Versión vigente:** Identidad 2026 (octubre de 2026, ADR-009). Reemplaza por completo al sistema azul anterior (Signal Blue `#2655E8`, Host Grotesk), que ya no se usa en ninguna parte.

**Fuentes de verdad**

| Qué | Dónde |
|---|---|
| Valores del sitio | `src/styles/tokens.css`, bloque *IDENTIDAD 2026* |
| Valores para documentos sueltos (informes, propuestas) | `public/marca/interforma-docs.css` |
| Tokens JSON | `design/tokens/*.json` |
| Logo | `src/components/base/Wordmark.astro`, `public/marca/isotipo.svg`, `public/favicon.svg` |
| Mascota | `src/lib/punto.ts`, `src/components/base/Punto.astro`, `src/styles/punto.css` |
| Animación de marca | `design/motion/` |

Si cambia un valor, se cambia en `tokens.css`, en `interforma-docs.css` y en este documento.

---

## 1. Principio

**«El Método como máquina».** Interforma vende un proceso, no aspiraciones. Cada elemento ocupa el espacio que merece, la tipografía trabaja sin decoración y el color de acción aparece solo donde se pide actuar.

**Rasgos clave**

- Un acento cálido, **Energía**, sobre neutros de piedra.
- Titulares en **Outfit 500**, cuerpo en **Manrope**, datos en **JetBrains Mono**.
- Plano por defecto; las sombras responden a un estado.
- Voz formal (**usted**) en todo el sitio y en los documentos para clientes.
- Movimiento discreto y siempre opcional (`prefers-reduced-motion`).

## 2. Color

### Marca

| Token | Hex | Uso |
|---|---|---|
| **Energía** | `#EE6E43` | Acción principal, superficies de llamada (sección CTA), acentos sobre Umbra, el círculo del isotipo y Punto. |
| Energía 400 | `#F2906D` | Hover de la acción principal. |
| Energía 600 | `#D9582E` | Texto naranja grande (≥ 24 px) sobre claro. |
| **Energía 800** | `#9A3D1A` | Texto, eyebrows, enlaces y foco naranja sobre fondos claros. |
| Energía 900 | `#7A2F13` | Texto pequeño naranja sobre claro con máximo contraste. |
| Energía 50 / 100 | `#FBE6DC` / `#F7CDBB` | Fondos suaves de énfasis, selección de texto. |
| **Umbra** | `#281F18` | Texto principal, fondos oscuros (Método, header de documentos), botón sobre Energía. |
| **Papel** | `#F2F1EE` | Superficie base del sitio, tarjetas, header. |
| **Piedra clara** | `#E4E3DF` | Fondo de secciones alternas y de página en documentos; `theme-color`. |
| Piedra | `#BEB8AE` | Bordes fuertes, series secundarias en gráficos. |
| Piedra 500 | `#8F887E` | Texto terciario. |
| Piedra 700 | `#5C564E` | Texto secundario. |
| Borde | `#D0CCC4` | Bordes y divisores por defecto. |
| **Cielo** | `#CCE2ED` | Acento frío puntual (la gota de Punto en «uy», series en gráficos). Nunca como color de acción. |

### Estados

| Token | Hex | Fondo |
|---|---|---|
| OK | `#18794E` | `#EFFAF6` |
| Alerta | `#A35200` | `#FFF8ED` |
| Error | `#C53030` | `#FFF0F0` |

### Reglas de color

- **Texto sobre Energía siempre en Umbra** (5,4:1). Nunca blanco (2,7:1).
- **Naranja sobre claro = Energía 800** (5,4:1). Energía 600 solo en tamaños ≥ 24 px.
- **Sobre Umbra, Energía directo** (5,4:1).
- **Una acción principal por bloque.** Energía marca la acción; no se usa como separador ni como decoración.
- **Neutros siempre cálidos.** No mezclar grises fríos (`#F5F5F5`, `#3D3D3B`, `#64748B`).
- **WhatsApp Green `#25D366`** solo en el botón flotante de WhatsApp.
- Los aliases `--agents-*`, `--primary-*` y `--cj-*` de `tokens.css` apuntan a esta paleta y se conservan por compatibilidad. En componentes nuevos, usar `--brand-*`, `--ink`, `--paper`, `--white` y `--gray-*`.

## 3. Tipografía

| Familia | Uso | Pesos |
|---|---|---|
| **Outfit** | Display, titulares (h1–h3), cifras grandes | 500 (700 solo en cifras de impacto) |
| **Manrope** | Cuerpo, UI, botones, eyebrows | 400–700 |
| **JetBrains Mono** | Datos, numeración de pasos, códigos y folios | 400–500 |

Todas están autoalojadas: en el sitio, vía `@fontsource` (`tokens.css`); en documentos, vía `/fonts/marca/` (`interforma-docs.css`). No se cargan fuentes desde Google Fonts.

**Jerarquía**

- **Display** (500, 40 → 84 px, lh 1,02, −0,02 em): solo el H1 del hero.
- **Headline** (500, 32–40 px, lh 1,2, −0,02 em): títulos de sección.
- **Title** (500, 24 px, lh 1,25): subsecciones y tarjetas.
- **Body XL / L** (400, 20 / 18 px, lh 1,55–1,65): bajadas. Máximo 48 ch.
- **Body** (400, 16 px, lh 1,6): párrafos. Máximo 65 ch.
- **Label / eyebrow** (500, 12 px, +0,08 em, MAYÚSCULAS): eyebrows en Energía 800 o Piedra 700; nunca en negrita.

## 4. Logo y mascota

- **Isotipo Transforma:** tres módulos en diagonal cuyo radio crece 3u → 9u → 15u hasta el círculo Energía, más el logotipo «interforma» en minúsculas.
- **Movimiento del isotipo:** al entrar en pantalla, una copia del módulo sube la diagonal redondeándose (≈ 1,7 s, una vez, CSS puro); se repite con hover o foco; estático con reduced motion.
- **Punto:** el círculo Energía con ojos Umbra. Es un personaje aparte; el logo oficial nunca lleva ojos. Ocho expresiones: `atento`, `saluda`, `escucha`, `piensa`, `trabaja`, `sorpresa`, `celebra`, `uy`. Sin boca, brazos ni otros colores (salvo la gota Cielo de `uy`). Bajo 24 px se usa el isotipo, salvo como avatar en interfaces densas. Hoy aparece como avatar del agente en `/agentes`, en el saludo junto al botón de WhatsApp (una vez por sesión) y en la página 404.

## 5. Layout

- **Contenedor:** máximo 1280 px; padding 20 px (móvil) → 32 px (≥ 768 px) → 48 px (≥ 1280 px).
- **Secciones:** 64–112 px de padding vertical.
- **Breakpoints:** 640, 768, 1024 y 1280 px.
- **Ritmo:** escala de 4 px; 16–24 px entre elementos relacionados.
- **Mobile-first:** una columna en móvil; grillas desde tablet.

## 6. Formas y elevación

| Token | Valor | Uso |
|---|---|---|
| `--radius-btn` | 11 px | Botones estándar (header, `/agentes`, `WhatsAppButton`, `Button`) |
| `--radius-cta` | 28 px | Botones grandes de hero y CTA final |
| `--radius-card` | 16 px | Tarjetas |
| `--radius-card-lg` | 20 px | Paneles grandes (Método, CTA) |
| `--radius-full` | 9999 px | Botón flotante de WhatsApp, chips, puntos |

No hay esquinas rectas en botones.

**Sombras:** plano por defecto. `--shadow-sm` en el header al hacer scroll y en hover de tarjetas; `--shadow-lg` solo en el botón flotante de WhatsApp.

## 7. Componentes

### Botones

| Variante | Fondo | Texto | Cuándo |
|---|---|---|---|
| **Primario** | Energía | Umbra | Acción principal sobre fondos claros o Umbra. Hover: Energía 400. |
| **Primario sobre Energía** | Umbra | Papel | Acción principal dentro de una superficie Energía (CTA final, `/agentes`). |
| **Secundario** | transparente, borde Umbra 1–2 px | Umbra | Acción alternativa. Sobre Energía: borde y texto Umbra. |
| **Ghost** | transparente | Umbra | Navegación secundaria («Ver el método →»). |

- Manrope 600–700, 16 px; `:active` → `scale(0.98)`.
- **Foco:** contorno de 2 px en Energía 800 con 2 px de separación (`--color-focus-ring`). Nunca se suprime.
- Implementaciones: `src/components/base/Button.astro`, `src/components/composite/WhatsAppButton.astro`. Tokens: `--color-action-bg`, `--color-action-bg-hover`, `--color-action-text`.

### Header

Sticky; fondo Papel con borde inferior; `--shadow-sm` al hacer scroll. Links en Piedra 700 → Umbra en hover. CTA «Hablar por WhatsApp» como botón primario.

### Eyebrow

12 px, 500, +0,08 em, mayúsculas; color Energía 800 (`--primary-500`) sobre claro, Energía (`--dark-accent`) sobre Umbra, o Piedra 700 cuando no es el foco. Siempre seguido de un título.

### Tarjetas

Papel sobre Piedra clara (o al revés), borde 1 px `--gray-200`, radio 16 px, sin sombra en reposo.

### Paneles oscuros (Método, demo de Agentes)

Fondo Umbra; tarjetas `--gray-800` con borde `--gray-700`; acentos en Energía. Las barras de progreso del Método usan un degradado de Piedra a Energía.

### Botón flotante de WhatsApp

56 px, círculo, WhatsApp Green, `--shadow-lg`, pulso suave (sin pulso con reduced motion). Junto a él, el saludo de Punto «¿Conversamos?».

## 8. Movimiento

- Entradas fade-up de 400 ms con `cubic-bezier(0.16, 1, 0.3, 1)`; sin rebotes.
- Animaciones *visible-first* (no bloquean el LCP).
- Con `prefers-reduced-motion`: sin traslados, escalas ni rotaciones; solo fades ≤ 250 ms.
- Piezas animadas para redes: motor en `design/motion/` (ver su README).

## 9. Datos y diagramas

**Series en gráficos** (en este orden): Energía `#EE6E43`, Umbra `#281F18`, Piedra `#BEB8AE`, Cielo `#CCE2ED`, Energía 400 `#F2906D`. Estados con OK / Alerta / Error.

**Excepciones permitidas**

1. **Colores de cada red social** (LinkedIn, Facebook, Instagram) cuando identifican la plataforma en un informe.
2. **Familias de categoría en diagramas de sistema** con más de cinco capas (por ejemplo, la propuesta de Medic-Home): se conservan para que cada capa siga siendo distinguible. Cabecera, tipografía, neutros y acentos siguen la marca.

**Diagramas interactivos** (`public/diagramas/`): Archify con la paleta de marca, modo «Activa» por defecto, `noindex` y canonical a su página.

## 10. Documentos para clientes

Informes, propuestas y presentaciones en HTML preparados por Interforma (`public/informes/`, `public/propuestas/`, `public/agente-medic-home/`):

- Enlazan `/marca/interforma-docs.css`, que carga las fuentes y las variables `--if-*`.
- Fondo Piedra clara, tarjetas Papel, encabezado Umbra, títulos en Outfit 500, cifras en Outfit o JetBrains Mono.
- Llevan `<meta name="robots" content="noindex, nofollow, noarchive">` y además el header `X-Robots-Tag` de `vercel.json` (ADR-011).
- Para un documento nuevo, partir de `public/informes/_template/informe-mensual-template.html`.

**Material con marca del cliente** (por ejemplo, `public/clientes/gatica-property/`) mantiene la identidad del cliente, no la de Interforma.

**Firmas de correo** (`email-signature/`): Umbra y Energía, con fuentes del sistema (los clientes de correo no cargan fuentes web) e isotipo en PNG o GIF.

## 11. Hacer y no hacer

**Hacer**

- Usar los tokens de `tokens.css` o `interforma-docs.css`, nunca hex sueltos en componentes nuevos.
- Una sola acción principal en Energía por bloque.
- Revisar contraste con las reglas de la §2 antes de usar naranja en texto.
- Mantener el usted en sitio y documentos.

**No hacer**

- Volver a Signal Blue, Host Grotesk, Plus Jakarta Sans, Inter, DM Sans o Playfair Display.
- Texto blanco sobre Energía.
- Grises fríos o negros puros en superficies (salvo la muesca del teléfono en mockups).
- Poner ojos al logo oficial.
- Inventar testimonios, métricas, clientes o nombres de empresa.
