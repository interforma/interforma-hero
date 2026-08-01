export interface OpenGraphProps {
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  type?: 'website' | 'article';
  locale?: string;
  siteName?: string;
}

export interface TwitterCardProps {
  card?: 'summary' | 'summary_large_image';
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  site?: string;
}

export interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  noindex?: boolean;
  og?: OpenGraphProps;
  twitter?: TwitterCardProps;
}
