export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
}

export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  images: string[];
  tags: string[];
  links: string[];
}

export interface Experience {
  title: string;
  description: string;
  skills: string[];
  startDate: Date;
  endDate: Date;
  company: string;
  website: string;
}

export interface Education {
  school: string;
  major: string;
  degree: string;
  startDate: Date;
  graduationDate: Date;
}

export interface Team {
  id: string;
  name: string;
  title: string;
  description: string;
  socials: string[];
  image: string;
  projects: Project[];
  experience: Experience[];
  education: Education[];
}
