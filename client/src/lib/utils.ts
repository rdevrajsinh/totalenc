import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/&/g, '-and-')      // Replace & with 'and'
    .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/-+$/, '');         // Trim - from end of text
}

export function getImagePlaceholder(type: string): string {
  switch (type) {
    case 'blog':
      return 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
    case 'product':
      return 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
    case 'service':
      return 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
    case 'profile':
      return 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80';
    case 'hero':
      return 'https://images.unsplash.com/photo-1581092921461-7a56d6f2eb2e?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80';
    default:
      return 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80';
  }
}

export function extractMetaDataFromHtml(html: string): { title: string; description: string } {
  // Extract first paragraph for description
  const descriptionMatch = html.match(/<p>(.*?)<\/p>/);
  const description = descriptionMatch 
    ? descriptionMatch[1].replace(/<[^>]*>/g, '').slice(0, 160) 
    : '';
  
  // Extract heading for title if available
  const titleMatch = html.match(/<h1>(.*?)<\/h1>/) || html.match(/<h2>(.*?)<\/h2>/);
  const title = titleMatch 
    ? titleMatch[1].replace(/<[^>]*>/g, '')
    : '';
  
  return { title, description };
}

export function getAuthToken(): string | null {
  return localStorage.getItem('authToken');
}

export function setAuthToken(token: string): void {
  localStorage.setItem('authToken', token);
}

export function removeAuthToken(): void {
  localStorage.removeItem('authToken');
}
