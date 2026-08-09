/**
 * Contenido provisional de Release 0.
 * PLACEHOLDER — Pendiente revisión y aprobación del equipo Interforma.
 * Derivado directamente del ADN y Method.md del repositorio.
 */

// Alternativas de headline para aprobación del equipo
export const headlineAlternatives = {
  A: 'Transformamos la forma en que tu empresa trabaja.',
  B: 'Transformación digital que tu equipo adopta.',
  current: 'A',
} as const;

export interface ProblemItem {
  id: number;
  title: string;
  description: string;
}

export interface MethodStep {
  id: number;
  number: string;
  name: string;
  description: string;
  output: string;
}

// ── Hero ─────────────────────────────────────────────────────────
export const heroCopy = {
  eyebrow: 'Transformación digital con método',
  headline: 'Transformamos la forma en que tu empresa trabaja.',
  subheadline:
    'Ayudamos a empresas medianas a implementar procesos digitales con resultados medibles — no solo tecnología que se instala.',
  primaryCta: 'Iniciar diagnóstico',
  secondaryCta: 'Ver el método',
  secondaryCtaHref: '#metodo',
} as const;

// ── Problemas ─────────────────────────────────────────────────────
export const problemsCopy = {
  eyebrow: 'El problema de fondo',
  headline: '¿Le suena familiar?',
  subheadline:
    'La mayoría de los proyectos de transformación digital no fracasan por la tecnología — fracasan por lo que ocurre alrededor.',
  frame:
    'Estos son los patrones que vemos con más frecuencia. Si reconoció alguno, no está solo — son exactamente los problemas que el Método Interforma está diseñado para resolver.',
} as const;

export const problems: ProblemItem[] = [
  {
    id: 1,
    title: 'Tecnología que nadie usa',
    description:
      'Se instalan sistemas costosos que el equipo evita o ignora. La herramienta queda, el proceso no cambia.',
  },
  {
    id: 2,
    title: 'Procesos sin mapear primero',
    description:
      'Se digitalizan flujos mal definidos. El software amplifica el caos en vez de resolverlo.',
  },
  {
    id: 3,
    title: 'Equipos que no adoptan',
    description:
      'Sin acompañamiento al cambio, el equipo vuelve al Excel. La inversión no genera retorno real.',
  },
  {
    id: 4,
    title: 'Sin resultados medibles',
    description:
      'Meses de implementación sin métricas claras. No se sabe si la inversión valió la pena.',
  },
  {
    id: 5,
    title: 'Proveedores sin contexto',
    description:
      'Soluciones genéricas que no consideran la realidad operativa ni la cultura de la empresa.',
  },
  {
    id: 6,
    title: 'Sistemas que no se integran',
    description:
      'Cada área trabaja en silos digitales. La información no fluye y los errores se multiplican.',
  },
];

// ── Método ────────────────────────────────────────────────────────
export const methodCopy = {
  eyebrow: 'Nuestro proceso',
  headline: 'El Método Interforma',
  subheadline:
    'Un proceso estructurado en seis etapas que garantiza resultados medibles y adopción real por parte del equipo.',
} as const;

export const methodSteps: MethodStep[] = [
  {
    id: 1,
    number: '01',
    name: 'Diagnóstico',
    description:
      'Mapeamos los procesos reales de la empresa — no los ideales. Identificamos fricciones, brechas digitales y oportunidades de impacto con entrevistas al equipo.',
    output: 'Diagnóstico + hoja de ruta priorizada',
  },
  {
    id: 2,
    number: '02',
    name: 'Diseño',
    description:
      'Diseñamos el nuevo flujo de trabajo antes de tocar ninguna tecnología. El proceso manda, la herramienta sirve.',
    output: 'Blueprint de procesos + propuesta tecnológica',
  },
  {
    id: 3,
    number: '03',
    name: 'Implementación',
    description:
      'Ejecutamos por etapas, con entregables concretos en cada sprint. Sin promesas vagas ni plazos imposibles.',
    output: 'Sistema en producción + documentación técnica',
  },
  {
    id: 4,
    number: '04',
    name: 'Integración',
    description:
      'Conectamos el nuevo sistema con las herramientas existentes. Los datos fluyen entre áreas sin intervención manual.',
    output: 'Flujos integrados + datos unificados',
  },
  {
    id: 5,
    number: '05',
    name: 'Adopción',
    description:
      'Capacitamos al equipo y acompañamos el cambio cultural. El sistema no sirve si nadie lo usa correctamente.',
    output: 'Equipo capacitado + protocolo de uso',
  },
  {
    id: 6,
    number: '06',
    name: 'Optimización',
    description:
      'Medimos, ajustamos y mejoramos continuamente. La transformación digital no termina en la implementación — evoluciona.',
    output: 'Métricas + ciclo de mejora continua',
  },
];

// ── CTA ───────────────────────────────────────────────────────────
export const ctaCopy = {
  eyebrow: 'Próximo paso',
  headline: 'Entendamos primero el verdadero problema de su empresa',
  subheadline:
    'Una conversación de 30 minutos puede revelar más que meses de implementación sin diagnóstico previo.',
  ctaLabel: 'Iniciar diagnóstico gratuito',
  note: 'Sin compromiso · Respuesta en menos de 24 horas',
} as const;

// ── Contacto ──────────────────────────────────────────────────────
export const contactCopy = {
  eyebrow: 'Contacto',
  headline: 'Hablemos sin compromiso',
  subheadline:
    'No vendemos tecnología. Diagnosticamos procesos y diseñamos soluciones adaptadas a su empresa.',
  whatsappLabel: 'Escribir por WhatsApp',
  emailLabel: 'Enviar un correo',
  note: 'Respondemos en menos de 24 horas hábiles.',
} as const;

// ── Footer ────────────────────────────────────────────────────────
export const footerCopy = {
  tagline: 'Transformación digital con método.',
  copyright: 'Interforma',
  legalNote: 'Todos los derechos reservados.',
} as const;
