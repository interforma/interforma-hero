---
name: Interforma
description: Consultora digital chilena — transformación con método, no con promesas
colors:
  energia: "#EE6E43"
  energia-600: "#D9582E"
  energia-800: "#9A3D1A"
  piedra-clara: "#E4E3DF"
  papel: "#F2F1EE"
  piedra: "#BEB8AE"
  piedra-700: "#5C564E"
  cielo: "#CCE2ED"
  umbra: "#281F18"
  whatsapp-green: "#25D366"
typography:
  display:
    fontFamily: "'Outfit Variable', 'Outfit', system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 5vw, 4.5rem)"
    fontWeight: 500
    lineHeight: 1.05
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
rounded:
  none: "0"
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
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
    rounded: "{rounded.full}"
    padding: "12px 20px"
  button-primary-hover:
    backgroundColor: "{colors.energia-600}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.energia}"
    rounded: "{rounded.full}"
    padding: "12px 20px"
  button-ghost-hover:
    backgroundColor: "{colors.papel}"
  nav-link:
    textColor: "{colors.piedra-700}"
    rounded: "{rounded.sm}"
    padding: "4px 8px"
  nav-link-hover:
    textColor: "{colors.umbra}"
---

# Design System: Interforma

> **Identidad 2026 (oct. 2026).** El azul señal fue reemplazado por **Energía `#EE6E43`** y los neutros pasan a piedra cálida (Piedra clara `#E4E3DF`, Papel `#F2F1EE`, Piedra `#BEB8AE`, Umbra `#281F18`, Cielo `#CCE2ED`). Titulares en **Outfit 500**, cuerpo en **Manrope**, datos en **JetBrains Mono**. Logo: isotipo **Transforma** (tres módulos en diagonal cuyo radio crece 3u→9u→15u hasta el círculo Energía) + logotipo "interforma" en minúsculas; ver `src/components/base/Wordmark.astro` y `public/favicon.svg`. **Movimiento del isotipo:** al entrar en pantalla, el módulo base aparece y una copia sube la diagonal redondeándose hasta el círculo Energía (≈1,7 s, una sola vez, CSS puro); se repite al pasar el cursor o enfocar el enlace; sin bucles; estático con `prefers-reduced-motion`. Fuente de verdad de valores: `src/styles/tokens.css` (bloque IDENTIDAD 2026).
>
> **Reglas de contraste:** sobre Energía el texto va siempre en Umbra (5,4:1), nunca en blanco (2,7:1). Texto o foco naranja sobre fondos claros usa Energía 800 `#9A3D1A` (5,4:1); en tamaños ≥24 px puede usarse Energía 600 `#D9582E`. Sobre Umbra, Energía directo (5,4:1).
>
> Las secciones siguientes describen la versión anterior (azul) y se mantienen como historial; donde contradigan esta nota, manda esta nota.

## Overview

**Creative North Star: "El Método como máquina"**

Interforma no vende aspiraciones — vende un proceso. El sistema visual refleja eso: cada elemento ocupa el espacio que merece, la tipografía trabaja sin decoración, y el único color de acento es exactamente tan prominente como la acción que pide. No hay ornamento que no sea función.

La densidad es media: suficiente espacio para respirar entre secciones, nunca tanto que el contenido se disperse. El fondo base es un blanco ligeramente cálido (#F9F9F8) que distingue la página de una pantalla vacía sin añadir color. Las secciones oscuras (Método, Footer) usan un azul-negro profundo (#15171C) que refuerza la seriedad del servicio. El azul señal (#2655E8) aparece solo en acciones: botones, links activos, estados de foco. Su escasez es su autoridad.

El movimiento es técnico y rápido: entradas de fade-up en 400ms con `cubic-bezier(0.16, 1, 0.3, 1)`, sin rebotes ni efectos de atención. El fondo del hero tiene una animación halftone generativa (canvas 2D, tres capas: blob/sphere/hexagon) con parallax scroll+pointer, única excepción ornamental justificada por ser el primer punto de contacto. La preferencia `prefers-reduced-motion` suprime todas las animaciones y transiciones.

**Key Characteristics:**
- Azul señal como único acento; neutrales cálidos para todo lo demás
- Host Grotesk Variable — grotesca geométrica, sin serif, tracking negativo en display
- Plano por defecto, sombras solo en respuesta a estado (hover, scroll)
- Espaciado en escala de 4px, secciones en 64-80px block
- Voz formal (usted), eyebrow en mayúsculas con 0.08em de tracking

---

## Colors

Paleta binaria: un azul señal saturado para la acción, y neutrales cálidos ligeramente amarronados para todo lo estructural. No hay secundario ni terciario.

### Primary
- **Signal Blue** (#2655E8): El único acento del sistema. Botones primarios, links en hover, estados de foco, elemento activo en nav. Aparece en menos del 15% de cualquier pantalla — su escasez es su fuerza.
- **Signal Blue Deep** (#1A44C9): Estado hover de los interactivos.
- **Signal Blue Deeper** (#1236A8): Estado active/pressed.
- **Signal Blue Faint** (#EEF2FD): Fondo sutil en hover del botón ghost y estados de énfasis suave.
- **Signal Blue Pale** (#D5DFFB): Selección de texto, acentos de bajo contraste.
- **Signal Blue Midnight** (#0B2060): Texto sobre fondos muy claros en contextos de máximo énfasis — raro.
- **Signal Blue on Dark** (#7BA3FF): Azul ajustado para legibilidad sobre fondos oscuros (#15171C).

**The One Accent Rule.** Signal Blue solo marca acción, estado activo, o foco. Nunca se usa decorativamente, como separador de sección, ni como fondo de contenedor. Cada aparición del azul es una invitación a actuar.

### Neutral
- **Warm Parchment** (#F9F9F8): Fondo de página — base de todo el sitio. Ligeramente más cálido que el blanco puro.
- **Surface White** (#FFFFFF): Superficies de tarjetas, header scrolled, overlay móvil.
- **Subtle Ground** (#F2F2F0): Fondo secundario, separadores implícitos.
- **Border Quiet** (#E8E8E5): Bordes de tarjetas y divisores por defecto.
- **Border Clear** (#D1D1CD): Bordes visibles en hover o contextos de mayor contraste.
- **Text Strong** (#111110): Texto primario — headlines, labels de botón, texto de acción.
- **Text Secondary** (#5A5A57): Cuerpo de texto, descripciones, nav links en reposo.
- **Text Quiet** (#737370): Texto terciario, eyebrows, notas, metadatos.
- **Text Muted** (#A5A5A0): Texto deshabilitado, placeholders.
- **Ink** (#111110): Fondo de secciones oscuras cuando se quiere máximo contraste.
- **Ink Refined** (#15171C): Fondo de la sección Método y el Footer — azul-negro profundo que no es negro puro.
- **WhatsApp Green** (#25D366): Color exclusivo del botón y FAB de WhatsApp. No reutilizar en ningún otro contexto.

**The Warm Neutral Rule.** Los neutrales de Interforma tienen un leve matiz cálido. Nunca mezclar con neutrales fríos puros (#F5F5F5, #9E9E9E) — la diferencia sutil rompe la cohesión.

---

## Typography

**Display / Body Font:** Host Grotesk Variable (con fallback a Plus Jakarta Sans Variable, -apple-system, sans-serif)
**Label Font:** Host Grotesk Variable (misma familia, tamaño reducido, tracking abierto)

**Character:** Grotesca geométrica variable, tracking negativo en display (-0.02em), que comunica precisión técnica sin frialdad. El peso semibold/bold es el valor por defecto para headings; el regular para cuerpo. Sin serif, sin decoración tipográfica.

### Hierarchy
- **Display** (700, 40px mobile → 72px desktop, 1.05 lh, -0.02em): Hero headline principal únicamente. Max 16-24ch de ancho.
- **Headline** (700, 32-40px, 1.15-1.2 lh, -0.02em): Titulares de sección (h2). Max 20ch.
- **Title** (600, 24px, 1.25 lh): Subtítulos de subsección, encabezados de tarjeta.
- **Body XL** (400, 20px, 1.65 lh): Subheadlines de hero y sección principal. Max 44-48ch.
- **Body Large** (400, 18px, 1.65 lh): Introducción de sección, texto de apoyo. Max 44-48ch.
- **Body** (400, 16px, 1.6 lh): Texto de descripción en tarjetas, párrafos. Max 65ch.
- **Body Small** (400, 14px, 1.55 lh): Notas, disclaimers, metadatos secundarios.
- **Label** (500, 12px, 1.4 lh, 0.08em, UPPERCASE): Eyebrows de sección, etiquetas de estado, numeración de pasos.

**The Eyebrow Rule.** Los eyebrows van siempre en mayúsculas, 12px, peso 500, tracking 0.08em, color text-quiet (#737370). Nunca en negrita. Son señalizadores, no headings.

**The Display Tracking Rule.** Display y Headline siempre con letter-spacing -0.02em. Por debajo de Title, el tracking es 0 o positivo (nunca negativo).

---

## Layout

Sistema de una sola columna en mobile, con transición a dos columnas en el Hero desktop (1fr + 480px fijo) a partir de 1024px. El resto del sitio es una columna centrada.

**Contenedor:** max-width 1280px, centrado, padding de 20px (mobile) → 32px (tablet 768px+) → 48px (desktop 1280px+).

**Secciones:** padding-block de 64px (secciones de apoyo) a 80px (secciones principales). El Hero usa min-height 88svh con padding-block 64px/48px.

**Breakpoints:** 640px (sm), 768px (md), 1024px (lg), 1280px (xl).

**Ritmo vertical:** escala de 4px. Espaciado entre elementos relacionados: 16-24px. Entre secciones: 64-80px.

**The One-Column Rule.** Fuera del Hero, el layout es siempre una columna centrada. No hay grids de contenido de dos o más columnas en versión mobile. La complejidad visual (diagrama, tarjetas de problema en grid) se introduce solo en desktop.

---

## Elevation & Depth

El sistema es **plano por defecto**. Las superficies en reposo no tienen sombra. La profundidad aparece solo como respuesta a estado o contexto de superposición.

### Shadow Vocabulary
- **Shadow SM** (`0 1px 2px 0 rgb(0 0 0 / 0.05)`): Header al hacer scroll (indica elevación sobre el contenido). El toque más sutil del sistema.
- **Shadow MD** (`0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05)`): No asignado aún en producción — disponible para modales pequeños o dropdowns.
- **Shadow LG** (`0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.05)`): Botón flotante de WhatsApp (FAB), contextos de mayor elevación.

**The Flat-By-Default Rule.** Las superficies no piden atención con sombras. El hover de tarjeta usa shadow-sm para indicar interactividad, no decoración. Solo el FAB de WhatsApp usa shadow-lg de forma permanente porque su función requiere separación visual constante del contenido.

---

## Shapes

Lenguaje de formas dual: **píldoras para acciones, curvado suave para contenedores**.

Los botones son píldoras completas (`border-radius: 9999px`) — forma que comunica acción directa y completada, sin ángulos que sugieran precaución. Las tarjetas y superficies de contenido usan 8-12px de radio (md/lg) — redondeado que es amigable sin ser infantil. Los elementos de navegación inline usan 4px (sm) — apenas suavizado.

No hay formas con bordes completamente rectos (radius 0) en el UI visible, excepto en elementos decorativos del diagrama y separadores. No hay formas con ángulos agresivos ni geometría compleja excepto en el fondo halftone generativo del hero.

El diagrama del sistema de método usa líneas rectas con nodos circulares pequeños — ingeniería visible, no ilustración.

**The Pill-for-Action Rule.** Cualquier elemento cuya función principal sea iniciar una acción del usuario (botón, FAB, CTA) usa `border-radius: full`. Los contenedores de información (tarjetas, superficies) usan lg (12px) o md (8px).

---

## Components

### Buttons

El botón no pide permiso. Relleno sólido con azul señal, píldora completa, texto blanco en semibold.

- **Shape:** píldora completa (9999px)
- **Primary (md):** fondo Signal Blue (#2655E8), texto blanco, padding 12px 20px, semibold 16px; hover → Signal Blue Deep (#1A44C9); active → scale(0.98); transición 100ms ease-default
- **Primary (lg):** padding 16px 32px, 18px font-size
- **Primary (sm):** padding 8px 16px, 14px font-size
- **Ghost:** fondo transparente, borde 2px Signal Blue, texto Signal Blue; hover → fondo Signal Blue Faint (#EEF2FD)
- **Focus:** outline 2px Signal Blue, offset 2px — nunca suprimido

### Navigation

- **Desktop nav link:** texto Text Secondary (#5A5A57), 16px medium, padding 4px 8px, radius 4px; hover → Text Strong (#111110); transición 100ms
- **Mobile overlay:** fondo Surface White (#FFFFFF), full viewport desde el header. Links 20px semibold con hover tint primary-50.
- **Header:** sticky, height 56px mobile / 64px desktop; en reposo transparente con borde transparent; al scroll → fondo Surface White, borde Border Quiet, shadow-sm

### Cards (Problema)

Superficies de información en grid.

- **Corner style:** radius lg (12px)
- **Background:** Surface White (#FFFFFF)
- **Border:** 1px Border Quiet (#E8E8E5)
- **Shadow:** none en reposo; shadow-sm en hover
- **Internal padding:** 24px
- **Hover:** border-color → Border Clear (#D1D1CD), sombra suave

### WhatsApp FAB

Componente de conversión permanente — el único componente que viola "flat by default".

- **Size:** 56px × 56px, círculo completo
- **Background:** WhatsApp Green (#25D366), permanente
- **Shadow:** shadow-lg permanente — su elevación es parte de su función
- **Pulse:** anillo animado rgba(37, 211, 102, 0.35) en loop 2.5s (suprimido con prefers-reduced-motion)
- **Hover:** scale(1.08), shadow mayor
- **Tooltip:** aparece a la izquierda en hover/focus

### Eyebrow (signature)

Etiqueta de sección — el patrón más recurrente del sistema.

- 12px, weight 500, letter-spacing 0.08em, text-transform uppercase, color Text Quiet (#737370)
- Siempre encima del headline de sección, margen inferior 16px
- Nunca en bold, nunca en el color primario, nunca sin el headline que le sigue

---

## Do's and Don'ts

### Do:
- **Do** usar Signal Blue (#2655E8) exclusivamente en elementos de acción: botones primarios, links activos, focus rings, el icono activo de navegación.
- **Do** usar Host Grotesk Variable con tracking negativo (-0.02em) en Display y Headline. Es la firma tipográfica del sistema.
- **Do** mantener fondos de sección en Warm Parchment (#F9F9F8) o Ink Refined (#15171C). No inventar fondos intermedios.
- **Do** usar píldoras completas (radius full) para todos los botones CTA y el FAB de WhatsApp.
- **Do** mantener el eyebrow en 12px, uppercase, tracking 0.08em, color text-quiet — sin variaciones de peso ni color.
- **Do** respetar `prefers-reduced-motion` suprimiendo toda animación de translate/scale/rotate; solo fades lentos (≤250ms) son aceptables.

### Don't:
- **Don't** usar Signal Blue como fondo de sección, separador decorativo, o borde no interactivo. El azul que no invita a actuar confunde.
- **Don't** mezclar neutrales fríos (grises puros #F5F5F5, #9E9E9E) con la paleta neutra cálida del sistema.
- **Don't** usar `border-radius: 0` en elementos de UI visibles salvo separadores y el sistema de diagrama.
- **Don't** añadir sombras a elementos en reposo fuera del FAB de WhatsApp. Las sombras son respuesta a estado.
- **Don't** fabricar testimonios, métricas, clientes, o nombres de empresa en el contenido del sitio.
- **Don't** romper la jerarquía tipográfica añadiendo pesos o tamaños fuera de la escala — ni bold en body, ni display fuera del hero.
