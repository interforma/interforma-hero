import { defineCollection, z } from 'astro:content';

/**
 * Casos de clientes y proyectos propios.
 * Un archivo YAML por caso en src/content/casos/.
 * Formato único (ver .interforma/CASOS.md): tipo, estado, título de resultado,
 * cliente · sector, una prueba verificable, stack y, si existe, página de detalle.
 */

const prueba = z.object({
  valor: z.string().max(12),
  etiqueta: z.string(),
});

const casos = defineCollection({
  type: 'data',
  schema: z.object({
    orden: z.number(),
    publicado: z.boolean().default(true),
    tipo: z.enum(['web', 'agente', 'marketing', 'datos', 'app']),
    estado: z.enum(['En desarrollo', 'Beta', 'Entregado', 'En operación', 'En curso']),
    titulo: z.string().max(80),
    cliente: z.string(),
    sector: z.string(),
    /** Un hecho comprobable. Nunca una cifra de rendimiento sin aprobación del cliente. */
    prueba,
    proximaFase: z.string().optional(),
    stack: z.array(z.string()).max(4),
    /** Sitio público del proyecto, cuando existe. */
    sitio: z.string().url().optional(),
    /** Burbujas de la ilustración de los casos de agente. */
    conversacion: z
      .array(z.object({ de: z.enum(['cliente', 'agente']), texto: z.string() }))
      .optional(),
    etiquetaDatos: z.string().optional(),
    detalle: z
      .object({
        resumen: z.string(),
        servicio: z.string(),
        estadoDesde: z.string().optional(),
        reto: z.object({ titulo: z.string(), parrafos: z.array(z.string()).min(1) }),
        solucion: z.object({
          titulo: z.string(),
          pasos: z.array(z.object({ titulo: z.string(), texto: z.string() })).min(2).max(6),
        }),
        pruebas: z.array(prueba).min(1).max(4),
        antes: z.string(),
        ahora: z.string(),
      })
      .optional(),
    /** Solo se muestra en el sitio cuando el cliente aprobó el texto final. */
    testimonio: z
      .object({
        cita: z.string(),
        nombre: z.string(),
        cargo: z.string().optional(),
        empresa: z.string(),
        aprobado: z.boolean().default(false),
      })
      .optional(),
  }),
});

export const collections = { casos };
