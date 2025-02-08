export interface ProjectsItem {
  _id: string;
    uz: {
      title: string;
      description: string;
      volume_of_tasks: string;
      customer: string;
      status: string;
      implementation_period: string;
    },
    en: {
      title: string;
      description: string;
      volume_of_tasks: string;
      customer: string;
      status: string;
      implementation_period: string;
    },
    ru: {
      title: string;
      description: string;
      volume_of_tasks: string;
      customer: string;
      status: string;
      implementation_period: string;
    },
    slug: string;
    cover: string;
    gallery: string[];
  }
  
  export interface ProjectsGridProps {
    items: ProjectsItem[];
    onEdit: (slug: string) => void;
    onDelete: (slug: string) => void;
  }
  