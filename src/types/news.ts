export interface NewsItem {
    title: string;
    slug: string;
    description: string;
    cover: string;
  }
  
  export interface NewsGridProps {
    items: NewsItem[];
    onPreview: (slug: string) => void;
    onEdit: (slug: string) => void;
    onDelete: (slug: string) => void;
  }
  