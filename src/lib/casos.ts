import { getCollection, type CollectionEntry } from 'astro:content';

export type Caso = CollectionEntry<'casos'>;
export type TipoCaso = Caso['data']['tipo'];
export type EstadoCaso = Caso['data']['estado'];

export const tipoLabel: Record<TipoCaso, string> = {
  web: 'Web',
  agente: 'Agente IA',
  marketing: 'Marketing digital',
  datos: 'Datos y automatización',
  app: 'Apps y producto',
};

/** Orden de los filtros en la sección. */
export const filtros: { id: 'todos' | TipoCaso; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'web', label: 'Web' },
  { id: 'agente', label: 'Agentes IA' },
  { id: 'marketing', label: 'Marketing digital' },
  { id: 'datos', label: 'Datos y automatización' },
  { id: 'app', label: 'Apps y producto' },
];

/** Tono de la insignia de estado: siempre acompañado de la palabra. */
export const estadoTono: Record<EstadoCaso, 'warning' | 'info' | 'success'> = {
  'En desarrollo': 'warning',
  Beta: 'info',
  Entregado: 'success',
  'En operación': 'success',
  'En curso': 'success',
};

export async function getCasos(): Promise<Caso[]> {
  const all = await getCollection('casos', ({ data }) => data.publicado);
  return all.sort((a, b) => a.data.orden - b.data.orden);
}

export function casoHref(caso: Caso): string | undefined {
  return caso.data.detalle ? `/casos/${caso.id}` : undefined;
}

/** Testimonios aprobados por el cliente; los borradores nunca se publican. */
export function testimoniosAprobados(casos: Caso[]) {
  return casos
    .filter((c) => c.data.testimonio?.aprobado)
    .map((c) => ({ caso: c, ...c.data.testimonio! }));
}

export function iniciales(nombre: string): string {
  return nombre
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}
