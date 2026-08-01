/**
 * Active font configuration.
 * Switch between 'host-grotesk' and 'plus-jakarta-sans' here.
 * Value is used in Base.astro to set a class on <html>.
 */
export const ACTIVE_FONT = 'host-grotesk' as const;
export type ActiveFont = 'host-grotesk' | 'plus-jakarta-sans';
