# Interforma Digital

Sitio web de [Interforma](https://interforma.digital) — consultora de transformación digital para empresas medianas en Chile.

## Stack

- **Framework:** [Astro](https://astro.build) 4.x
- **Deploy:** [Vercel](https://vercel.com)
- **Tipografía:** Host Grotesk (variable)
- **Analytics:** GA4 + Microsoft Clarity

## Estructura

```
src/
├── components/     # Componentes Astro (Hero, Método, Problemas, CTA, etc.)
├── config/         # Variables de contenido y configuración
├── content/        # Copy y datos del sitio
├── layouts/        # Layout base con SEO
├── lib/            # Utilidades (analytics, observers)
├── pages/          # Páginas (index, 404)
└── styles/         # Design tokens y estilos globales

email-signature/    # Firma de correo HTML
handoff/            # Archivos de diseño y moodboards
docs/               # Documentación interna
specs/              # Especificaciones de componentes
```

## Desarrollo local

```bash
pnpm install
pnpm dev
```

Crea un archivo `.env.local` con las variables necesarias (ver `.env.example` si existe).

## Deploy

El sitio se despliega automáticamente en Vercel al hacer push a `main`.

## Producto

Ver [`PRODUCT.md`](./PRODUCT.md) para contexto de producto, usuarios objetivo y principios de diseño.

---

**Contacto:** +56 9 8540 8771 (WhatsApp)
