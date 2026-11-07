/**
 * Libreta de Fierros (app propia de Interforma).
 * La lista de espera vive en el proyecto de Supabase de la app, tabla `lista_espera`
 * (repo interforma/libreta-de-fierros, migración 20261028000000_lista_espera.sql).
 * La clave es publicable: con ella solo se puede insertar, nunca leer (RLS + grants).
 */
export const libreta = {
  supabaseUrl: 'https://iuamjwwgivnmgrqdjqas.supabase.co',
  supabasePublishableKey: 'sb_publishable_gMAt_P8rQJ0NYzkpL46ibQ_IA2sGYiy',
} as const;
