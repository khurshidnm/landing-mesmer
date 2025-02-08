export interface NewsItem {
  uz: {
    title: string;
    description: string;
    content: string;
  };
  en: {
    title: string;
    description: string;
    content: string;
  };
  ru: {
    title: string;
    description: string;
    content: string;
  };
  slug: string;
  cover: string;
  locale?: string;
}

export interface NewsGridProps {
  items: NewsItem[];
  onPreview: (slug: string) => void;
  onEdit: (slug: string) => void;
  onDelete: (slug: string) => void;
}
