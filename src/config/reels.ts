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
  /** Identificador único (slug). */
  id: string;
  /** URL pública del video (.mp4). */
  src: string;
  /** URL pública del poster/thumbnail (.jpg). */
  poster: string;
  /** Descripción breve (se usa como caption y alt). */
  caption: string;
  /** Categoría editorial. */
  serie: ReelSerie;
  /** Link al reel original en Instagram (opcional). */
  instagram?: string;
  /** Fecha de publicación (YYYY-MM-DD). */
  date: string;
}

/**
 * Reels ordenados del más reciente al más antiguo.
 *
 * URL base de Supabase Storage:
 * https://iuamjwwgivnmgrqdjqas.supabase.co/storage/v1/object/public/reels/<nombre>.mp4
 */
const STORAGE = 'https://iuamjwwgivnmgrqdjqas.supabase.co/storage/v1/object/public/reels';

export const reels: Reel[] = [
  {
    id: 'cap08-reglas-de-la-casa',
    src: `${STORAGE}/cap08-reglas-de-la-casa-v2.mp4`,
    poster: `${STORAGE}/thumb-cap08.jpg`,
    caption: 'Reglas de la casa — ley de protección de datos y lo que significa para tu empresa.',
    serie: 'capsula',
    date: '2026-11-05',
  },
  {
    id: 'barrio-ep02-cuidadoras',
    src: `${STORAGE}/barrio-ep02-cuidadoras.mp4`,
    poster: `${STORAGE}/thumb-barrio-ep02.jpg`,
    caption: 'El Barrio de Punto, Ep. 2 — cuando la tecnología acompaña a quienes cuidan.',
    serie: 'serie',
    date: '2026-11-04',
  },
  {
    id: 'caso-real-firstcargo',
    src: `${STORAGE}/caso-real-first-cargo.mp4`,
    poster: `${STORAGE}/thumb-firstcargo.jpg`,
    caption: 'First Cargo — automatización logística con resultados medibles.',
    serie: 'caso',
    date: '2026-11-04',
  },
  {
    id: 'barrio-ep01-dona-rosa',
    src: `${STORAGE}/barrio-ep01-dona-rosa.mp4`,
    poster: `${STORAGE}/thumb-barrio-ep01.jpg`,
    caption: 'El Barrio de Punto, Ep. 1 — el negocio de barrio que se transformó.',
    serie: 'serie',
    date: '2026-10-30',
  },
  {
    id: 'cap04-agente-ia',
    src: `${STORAGE}/cap04-agente-ia-v2.mp4`,
    poster: `${STORAGE}/thumb-cap04.jpg`,
    caption: 'El nuevo en el equipo — qué es un agente de IA y cómo se integra al trabajo.',
    serie: 'capsula',
    date: '2026-10-28',
  },
  {
    id: 'cap05-el-mito',
    src: `${STORAGE}/cap05-el-mito-reel.mp4`,
    poster: `${STORAGE}/thumb-cap05.jpg`,
    caption: 'El mito — lo que la gente cree sobre transformación digital vs. la realidad.',
    serie: 'capsula',
    date: '2026-10-27',
  },
  {
    id: 'punto-en-accion-automotora',
    src: `${STORAGE}/punto-en-accion-automotora-v2.mp4`,
    poster: `${STORAGE}/thumb-automotora.jpg`,
    caption: 'Automotora — agente de IA atendiendo consultas en tiempo real.',
    serie: 'punto-en-accion',
    date: '2026-10-26',
  },
  {
    id: 'punto-en-accion-clinica',
    src: `${STORAGE}/punto-en-accion-clinica-v2.mp4`,
    poster: `${STORAGE}/thumb-clinica.jpg`,
    caption: 'Clínica — gestión de citas y consultas con inteligencia artificial.',
    serie: 'punto-en-accion',
    date: '2026-10-26',
  },
  {
    id: 'cap03-planillas',
    src: `${STORAGE}/cap03-planillas-reel.mp4`,
    poster: `${STORAGE}/thumb-cap03.jpg`,
    caption: 'Planillas — el problema silencioso que frena a las empresas.',
    serie: 'capsula',
    date: '2026-10-26',
  },
  {
    id: 'metodo-interforma',
    src: `${STORAGE}/metodo-interforma-punto.mp4`,
    poster: `${STORAGE}/thumb-metodo.jpg`,
    caption: 'El Método Interforma: así transformamos procesos, no solo tecnología.',
    serie: 'capsula',
    date: '2026-10-21',
  },
  {
    id: 'la-semilla',
    src: `${STORAGE}/interforma-la-semilla-v2.mp4`,
    poster: `${STORAGE}/thumb-semilla.jpg`,
    caption: 'La Semilla: el origen de Interforma y por qué hacemos lo que hacemos.',
    serie: 'serie',
    date: '2026-10-21',
  },
];
