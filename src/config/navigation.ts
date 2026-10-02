export interface NavItem {
  label: string;
  href: string;
  trackEvent: string;
}

export const navigation: NavItem[] = [
  { label: 'Método',    href: '/#metodo',    trackEvent: 'nav_click_metodo' },
  { label: 'Servicios', href: '/#servicios', trackEvent: 'nav_click_servicios' },
  { label: 'Sectores',  href: '/#sectores',  trackEvent: 'nav_click_sectores' },
  { label: 'Agentes',   href: '/agentes',    trackEvent: 'nav_click_agentes' },
  { label: 'Contacto',  href: '/#contacto',  trackEvent: 'nav_click_contacto' },
];
