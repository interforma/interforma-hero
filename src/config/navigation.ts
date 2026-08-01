export interface NavItem {
  label: string;
  href: string;
  trackEvent: string;
}

export const navigation: NavItem[] = [
  { label: 'Inicio',    href: '#inicio',    trackEvent: 'nav_click_inicio' },
  { label: 'Problemas', href: '#problemas', trackEvent: 'nav_click_problemas' },
  { label: 'Método',    href: '#metodo',    trackEvent: 'nav_click_metodo' },
  { label: 'Contacto',  href: '#contacto',  trackEvent: 'nav_click_contacto' },
];
