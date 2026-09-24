export interface Vacancy {
  _id: string;
  en: {
    title: string;
    company: string;
    conditions: string[];
    requirements: string[];
    responsibilities: string[];
  };
  uz: {
    title: string;
    company: string;
    conditions: string[];
    requirements: string[];
    responsibilities: string[];
  };
  ru: {
    title: string;
    company: string;
    conditions: string[];
    requirements: string[];
    responsibilities: string[];
  };
  salary: string;
  slug: string;
  category?: string;
}
