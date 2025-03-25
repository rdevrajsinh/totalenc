// Site metadata types
export interface SiteMetadata {
  title: string;
  description: string;
  url: string;
  favicon?: string;
  og?: {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
  };
}

// Navigation types
export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

// Blog types
export interface Blog {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author: string;
  status: 'draft' | 'published' | 'scheduled';
  publishDate: string | Date;
  images: string[];
  categories: string[];
  tags: string[];
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface BlogFormData {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author: string;
  status: 'draft' | 'published' | 'scheduled';
  publishDate: string | Date;
  images: string[];
  categories: string[];
  tags: string[];
  metaTitle?: string;
  metaDescription?: string;
}

// Product types
export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  image?: string;
  category?: string;
  featured: boolean;
  createdAt: string | Date;
}

// Service types
export interface Service {
  id: number;
  name: string;
  slug: string;
  description: string;
  fullDescription?: string;
  image?: string;
  featured: boolean;
  createdAt: string | Date;
  parentId?: number | null;
  order?: number;
  metaTitle?: string;
  metaDescription?: string;
  features?: string[];
  benefits?: string[];
  relatedServices?: number[];
  children?: Service[]; // Used for hierarchical display
}

// Contact form types
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

// Authentication types
export interface User {
  id: number;
  username: string;
  token: string;
}

export interface LoginFormData {
  username: string;
  password: string;
}
