export const site = {
  name: 'Interforma',
  url: 'https://interforma.digital/',
  defaultTitle: 'Interforma — Transformación digital real para empresas medianas',
  defaultDescription:
    'Ayudamos a empresas medianas a implementar transformación digital con procesos que su equipo adopta, no solo tecnología que se instala.',
  defaultOgImage: '/og-image.png',
  locale: 'es_CL',
  twitterHandle: '@interforma',
  contactEmail: import.meta.env.PUBLIC_CONTACT_EMAIL ?? '',
  whatsappNumber: import.meta.env.PUBLIC_WHATSAPP_NUMBER || '56985408771',
  whatsappMessage:
    import.meta.env.PUBLIC_WHATSAPP_MESSAGE ||
    'Hola. Quisiera conversar sobre cómo el Método Interforma puede ayudar a transformar los procesos de mi empresa.',
  /** Mensaje prellenado de WhatsApp para consultas de Interforma Agents. */
  whatsappAgentsMessage:
    'Hola. Quisiera conversar sobre un piloto de Interforma Agents para mi empresa.',
  /** Agenda de reuniones (Cal.com). Se puede sobrescribir con PUBLIC_CAL_URL. */
  calUrl:
    import.meta.env.PUBLIC_CAL_URL ||
    'https://cal.com/interforma-marketing-diseno-wuxobg/conversemos-sobre-tu-proyecto',
} as const;

/** URL de WhatsApp con mensaje prellenado. */
export function whatsappUrl(message: string = site.whatsappMessage): string {
  return `https://wa.me/${site.whatsappNumber}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
}
