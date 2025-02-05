export interface ProjectsItem {
    uz: {
      title: string;
      description: string;
      volume_of_tasks: string;
      customer: string;
      status: string;
      implementation_period: string;
    },
    oz: {
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
    onPreview: (slug: string) => void;
    onEdit: (slug: string) => void;
    onDelete: (slug: string) => void;
  }
  