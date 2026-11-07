/**
 * Reels de Instagram alojados en Supabase Storage.
 * Para agregar un reel: sube el .mp4 y el .jpg (poster) al bucket,
 * luego agrega una entrada aquí.
 */

export type ReelSerie = 'capsula' | 'caso' | 'serie' | 'punto-en-accion';

export const serieLabels: Record<ReelSerie, string> = {
  capsula: 'Cápsula',
  caso: 'Caso real',
  serie: 'Serie',
  'punto-en-accion': 'Punto en Acción',
};

export interface Reel {
  /** Identificador único (slug) — se usa en la URL /reels/{id}. */
  id: string;
  /** URL pública del video (.mp4). */
  src: string;
  /** URL pública del poster/thumbnail (.jpg). */
  poster: string;
  /** Descripción breve (se usa como caption en el carrusel). */
  caption: string;
  /** Categoría editorial. */
  serie: ReelSerie;
  /** Título SEO de la página individual. */
  seoTitle: string;
  /** Descripción editorial para la página individual y meta description. */
  descripcion: string;
  /** Duración del video en formato ISO 8601 (PT1M30S). */
  duracion?: string;
  /** Link al reel original en Instagram (opcional). */
  instagram?: string;
  /** Fecha de publicación (YYYY-MM-DD). */
  date: string;
}

/** Máximo de reels mostrados en el carrusel de la home. */
export const REELS_HOME_LIMIT = 4;

/**
 * Reels ordenados del más reciente al más antiguo.
 *
 * URL base de Supabase Storage:
 * https://iuamjwwgivnmgrqdjqas.supabase.co/storage/v1/object/public/reels/<nombre>.mp4
 */
const STORAGE = 'https://iuamjwwgivnmgrqdjqas.supabase.co/storage/v1/object/public/reels';

export const reels: Reel[] = [
  {
    id: 'ley-proteccion-datos-empresas',
    src: `${STORAGE}/cap08-reglas-de-la-casa-v2.mp4`,
    poster: `${STORAGE}/thumb-cap08.jpg`,
    caption: 'Reglas de la casa — ley de protección de datos y lo que significa para tu empresa.',
    serie: 'capsula',
    seoTitle: 'Ley de protección de datos: lo que tu empresa necesita saber',
    descripcion: 'La ley de protección de datos personales en Chile ya es una realidad. En este video explicamos qué implica para las empresas medianas, qué datos estás guardando sin saberlo y cómo prepararte antes de que sea obligatorio.',
    duracion: 'PT1M',
    date: '2026-11-05',
  },
  {
    id: 'tecnologia-para-cuidadoras',
    src: `${STORAGE}/barrio-ep02-cuidadoras.mp4`,
    poster: `${STORAGE}/thumb-barrio-ep02.jpg`,
    caption: 'El Barrio de Punto, Ep. 2 — cuando la tecnología acompaña a quienes cuidan.',
    serie: 'serie',
    seoTitle: 'Cómo la tecnología puede ayudar a las cuidadoras a domicilio',
    descripcion: 'Carmen coordina 12 cuidadoras a domicilio con WhatsApp y una libreta. En este episodio de El Barrio de Punto vemos cómo un sistema simple de gestión puede cambiar la operación de un servicio de cuidado.',
    duracion: 'PT1M',
    date: '2026-11-04',
  },
  {
    id: 'caso-first-cargo-automatizacion-logistica',
    src: `${STORAGE}/caso-real-first-cargo.mp4`,
    poster: `${STORAGE}/thumb-firstcargo.jpg`,
    caption: 'First Cargo — automatización logística con resultados medibles.',
    serie: 'caso',
    seoTitle: 'Caso First Cargo: automatización logística para empresas de transporte',
    descripcion: 'First Cargo procesaba cotizaciones manualmente. Implementamos un agente de IA que responde consultas y genera cotizaciones en tiempo real. El resultado: respuestas inmediatas y un equipo enfocado en lo que importa.',
    duracion: 'PT1M30S',
    date: '2026-11-04',
  },
  {
    id: 'negocio-de-barrio-transformacion-digital',
    src: `${STORAGE}/barrio-ep01-dona-rosa.mp4`,
    poster: `${STORAGE}/thumb-barrio-ep01.jpg`,
    caption: 'El Barrio de Punto, Ep. 1 — el negocio de barrio que se transformó.',
    serie: 'serie',
    seoTitle: 'Transformación digital en negocios de barrio: la historia de Doña Rosa',
    descripcion: 'Doña Rosa tiene un almacén y todo lo anota en un cuaderno. En este primer episodio de El Barrio de Punto exploramos cómo la transformación digital puede llegar a cualquier negocio, sin importar su tamaño.',
    duracion: 'PT1M',
    date: '2026-10-30',
  },
  {
    id: 'que-es-agente-ia-empresas',
    src: `${STORAGE}/cap04-agente-ia-v2.mp4`,
    poster: `${STORAGE}/thumb-cap04.jpg`,
    caption: 'El nuevo en el equipo — qué es un agente de IA y cómo se integra al trabajo.',
    serie: 'capsula',
    seoTitle: 'Qué es un agente de IA y cómo se integra a una empresa',
    descripcion: 'Un agente de IA no es un chatbot genérico. Es un sistema que entiende tu negocio, responde como tu equipo y trabaja 24/7. En este video explicamos qué es, cómo funciona y qué puede hacer por una empresa mediana.',
    duracion: 'PT1M',
    date: '2026-10-28',
  },
  {
    id: 'mitos-transformacion-digital',
    src: `${STORAGE}/cap05-el-mito-reel.mp4`,
    poster: `${STORAGE}/thumb-cap05.jpg`,
    caption: 'El mito — lo que la gente cree sobre transformación digital vs. la realidad.',
    serie: 'capsula',
    seoTitle: 'Los mitos de la transformación digital que frenan a las empresas',
    descripcion: 'Hay empresas que creen que la transformación digital es solo comprar software. Otras piensan que es solo para grandes corporaciones. En este video desmontamos los mitos más comunes que vemos en empresas medianas en Chile.',
    duracion: 'PT1M',
    date: '2026-10-27',
  },
  {
    id: 'agente-ia-automotora',
    src: `${STORAGE}/punto-en-accion-automotora-v2.mp4`,
    poster: `${STORAGE}/thumb-automotora.jpg`,
    caption: 'Automotora — agente de IA atendiendo consultas en tiempo real.',
    serie: 'punto-en-accion',
    seoTitle: 'Agente de IA para automotoras: atención al cliente automatizada',
    descripcion: 'Un agente de IA entrenado con el inventario de una automotora responde consultas sobre vehículos, disponibilidad y financiamiento en tiempo real por WhatsApp. Sin esperas, sin formularios.',
    duracion: 'PT1M',
    date: '2026-10-26',
  },
  {
    id: 'agente-ia-clinica',
    src: `${STORAGE}/punto-en-accion-clinica-v2.mp4`,
    poster: `${STORAGE}/thumb-clinica.jpg`,
    caption: 'Clínica — gestión de citas y consultas con inteligencia artificial.',
    serie: 'punto-en-accion',
    seoTitle: 'Agente de IA para clínicas: gestión de citas automatizada',
    descripcion: 'Un agente de IA gestiona las consultas de pacientes, agenda citas y responde preguntas frecuentes por WhatsApp. La recepción se enfoca en la atención presencial.',
    duracion: 'PT1M',
    date: '2026-10-26',
  },
  {
    id: 'planillas-problema-empresas',
    src: `${STORAGE}/cap03-planillas-reel.mp4`,
    poster: `${STORAGE}/thumb-cap03.jpg`,
    caption: 'Planillas — el problema silencioso que frena a las empresas.',
    serie: 'capsula',
    seoTitle: 'Por qué las planillas Excel frenan el crecimiento de tu empresa',
    descripcion: 'El 80% de las empresas medianas opera con planillas que nadie entiende, nadie mantiene y todos copian. En este video mostramos por qué las planillas son el síntoma de un problema más profundo y qué hacer al respecto.',
    duracion: 'PT1M',
    date: '2026-10-26',
  },
  {
    id: 'metodo-interforma-transformacion-digital',
    src: `${STORAGE}/metodo-interforma-punto.mp4`,
    poster: `${STORAGE}/thumb-metodo.jpg`,
    caption: 'El Método Interforma: así transformamos procesos, no solo tecnología.',
    serie: 'capsula',
    seoTitle: 'El Método Interforma: 6 etapas para transformar procesos de empresa',
    descripcion: 'La mayoría de los proyectos de transformación digital fracasan porque se enfocan en la tecnología y no en el proceso. El Método Interforma tiene 6 etapas que garantizan adopción real y resultados medibles.',
    duracion: 'PT1M',
    date: '2026-10-21',
  },
  {
    id: 'origen-interforma',
    src: `${STORAGE}/interforma-la-semilla-v2.mp4`,
    poster: `${STORAGE}/thumb-semilla.jpg`,
    caption: 'La Semilla: el origen de Interforma y por qué hacemos lo que hacemos.',
    serie: 'serie',
    seoTitle: 'La historia detrás de Interforma: por qué existe esta consultora',
    descripcion: 'Interforma nació de una convicción: que las empresas medianas merecen acceso a las mismas herramientas que las grandes, pero adaptadas a su realidad. Esta es la historia de cómo empezó todo.',
    duracion: 'PT1M',
    date: '2026-10-21',
  },
];
