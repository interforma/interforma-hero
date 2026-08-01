export const site = {
  name: 'Interforma',
  url: 'https://interforma.digital',
  defaultTitle: 'Interforma — Transformación digital real para empresas medianas',
  defaultDescription:
    'Ayudamos a empresas medianas a implementar transformación digital con procesos que su equipo adopta, no solo tecnología que se instala.',
  defaultOgImage: '/og-image.png',
  locale: 'es_CL',
  twitterHandle: '@interforma',
  contactEmail: import.meta.env.PUBLIC_CONTACT_EMAIL ?? '',
  whatsappNumber: import.meta.env.PUBLIC_WHATSAPP_NUMBER ?? '',
  whatsappMessage: import.meta.env.PUBLIC_WHATSAPP_MESSAGE ?? '',
} as const;
