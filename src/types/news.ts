export interface NewsItem {
  uz: {
    title: string;
    description: string;
    content: string;
  };
  oz: {
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
}

export interface NewsGridProps {
  items: NewsItem[];
  onPreview: (slug: string) => void;
  onEdit: (slug: string) => void;
  onDelete: (slug: string) => void;
}
