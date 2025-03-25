import { Client } from '@replit/object-storage';
import { 
  users, type User, type InsertUser,
  blogPosts, type BlogPost, type InsertBlogPost,
  products, type Product, type InsertProduct,
  services, type Service, type InsertService,
  contactMessages, type ContactMessage, type InsertContactMessage,
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Blog operations
  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPostById(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(blogPost: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, blogPost: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;

  // Product operations
  getProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  getFeaturedProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;

  // Service operations
  getServices(): Promise<Service[]>;
  getServiceById(id: number): Promise<Service | undefined>;
  getServiceBySlug(slug: string): Promise<Service | undefined>;
  getFeaturedServices(): Promise<Service[]>;
  getServicesByParentId(parentId: number | null): Promise<Service[]>;
  getServiceHierarchy(): Promise<Service[]>;
  getRelatedServices(serviceId: number): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, service: Partial<InsertService>): Promise<Service | undefined>;
  deleteService(id: number): Promise<boolean>;

  // Contact message operations
  getContactMessages(): Promise<ContactMessage[]>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  markContactMessageAsRead(id: number): Promise<ContactMessage | undefined>;
  deleteContactMessage(id: number): Promise<boolean>;
}

export class CloudStorage implements IStorage {
  private client: Client;
  private counters: { [key: string]: number };

  constructor() {
    this.client = new Client();
    this.counters = {};
    this.initCounters();
  }

  private async initCounters() {
    try {
      const counterData = await this.client.download_from_text('counters.json');
      this.counters = JSON.parse(counterData);
    } catch {
      this.counters = {
        users: 1,
        blogs: 1,
        products: 1,
        services: 1,
        contacts: 1
      };
      await this.saveCounters();
    }
  }

  private async saveCounters() {
    await this.client.upload_from_text('counters.json', JSON.stringify(this.counters));
  }

  private async getNextId(type: string): Promise<number> {
    const id = this.counters[type]++;
    await this.saveCounters();
    return id;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    try {
      const data = await this.client.download_from_text(`users/${id}.json`);
      return JSON.parse(data);
    } catch {
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const usersData = await this.client.list('users/');
      for (const key of usersData) {
        const userData = await this.client.download_from_text(key);
        const user = JSON.parse(userData);
        if (user.username === username) return user;
      }
    } catch {}
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = await this.getNextId('users');
    const user: User = { ...insertUser, id };
    await this.client.upload_from_text(`users/${id}.json`, JSON.stringify(user));
    return user;
  }

  // Blog operations
  async getBlogPosts(): Promise<BlogPost[]> {
    try {
      const posts: BlogPost[] = [];
      const blogFiles = await this.client.list('blogs/');
      for (const file of blogFiles) {
        const data = await this.client.download_from_text(file);
        posts.push(JSON.parse(data));
      }
      return posts.sort((a, b) => 
        new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
      );
    } catch {
      return [];
    }
  }

  async getBlogPostById(id: number): Promise<BlogPost | undefined> {
    try {
      const data = await this.client.download_from_text(`blogs/${id}.json`);
      return JSON.parse(data);
    } catch {
      return undefined;
    }
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const posts = await this.getBlogPosts();
    return posts.find(post => post.slug === slug);
  }

  async createBlogPost(insertBlogPost: InsertBlogPost): Promise<BlogPost> {
    const id = await this.getNextId('blogs');
    const now = new Date();
    const blogPost: BlogPost = { 
      ...insertBlogPost,
      id,
      createdAt: now,
      updatedAt: now
    };
    await this.client.upload_from_text(`blogs/${id}.json`, JSON.stringify(blogPost));
    return blogPost;
  }

  async updateBlogPost(id: number, blogPostUpdate: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const existingPost = await this.getBlogPostById(id);
    if (!existingPost) return undefined;

    const updatedPost: BlogPost = {
      ...existingPost,
      ...blogPostUpdate,
      updatedAt: new Date()
    };
    await this.client.upload_from_text(`blogs/${id}.json`, JSON.stringify(updatedPost));
    return updatedPost;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    try {
      await this.client.delete(`blogs/${id}.json`);
      return true;
    } catch {
      return false;
    }
  }

  // Product operations
  async getProducts(): Promise<Product[]> {
    try {
      const products: Product[] = [];
      const productFiles = await this.client.list('products/');
      for (const file of productFiles) {
        const data = await this.client.download_from_text(file);
        products.push(JSON.parse(data));
      }
      return products;
    } catch {
      return [];
    }
  }

  async getProductById(id: number): Promise<Product | undefined> {
    try {
      const data = await this.client.download_from_text(`products/${id}.json`);
      return JSON.parse(data);
    } catch {
      return undefined;
    }
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const products = await this.getProducts();
    return products.find(product => product.slug === slug);
  }

  async getFeaturedProducts(): Promise<Product[]> {
    const products = await this.getProducts();
    return products.filter(product => product.featured);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = await this.getNextId('products');
    const now = new Date();
    const product: Product = { 
      ...insertProduct,
      id,
      createdAt: now
    };
    await this.client.upload_from_text(`products/${id}.json`, JSON.stringify(product));
    return product;
  }

  async updateProduct(id: number, productUpdate: Partial<InsertProduct>): Promise<Product | undefined> {
    const existingProduct = await this.getProductById(id);
    if (!existingProduct) return undefined;

    const updatedProduct: Product = {
      ...existingProduct,
      ...productUpdate
    };
    await this.client.upload_from_text(`products/${id}.json`, JSON.stringify(updatedProduct));
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    try {
      await this.client.delete(`products/${id}.json`);
      return true;
    } catch {
      return false;
    }
  }

  // Service operations
  async getServices(): Promise<Service[]> {
    try {
      const services: Service[] = [];
      const serviceFiles = await this.client.list('services/');
      for (const file of serviceFiles) {
        const data = await this.client.download_from_text(file);
        services.push(JSON.parse(data));
      }
      return services;
    } catch {
      return [];
    }
  }

  async getServiceById(id: number): Promise<Service | undefined> {
    try {
      const data = await this.client.download_from_text(`services/${id}.json`);
      return JSON.parse(data);
    } catch {
      return undefined;
    }
  }

  async getServiceBySlug(slug: string): Promise<Service | undefined> {
    const services = await this.getServices();
    return services.find(service => service.slug === slug);
  }

  async getFeaturedServices(): Promise<Service[]> {
    const services = await this.getServices();
    return services.filter(service => service.featured);
  }

  async getServicesByParentId(parentId: number | null): Promise<Service[]> {
    const services = await this.getServices();
    return services.filter(service => {
      if (parentId === null) {
        return service.parentId === undefined || service.parentId === null;
      }
      return service.parentId === parentId;
    }).sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  async getServiceHierarchy(): Promise<Service[]> {
    const mainServices = await this.getServicesByParentId(null);
    for (const service of mainServices) {
      const children = await this.getServicesByParentId(service.id);
      (service as any).children = children;
    }
    return mainServices;
  }

  async getRelatedServices(serviceId: number): Promise<Service[]> {
    const service = await this.getServiceById(serviceId);
    if (!service || !service.relatedServices || !Array.isArray(service.relatedServices)) {
      return [];
    }

    const relatedServices: Service[] = [];
    for (const relatedId of service.relatedServices) {
      const relatedService = await this.getServiceById(relatedId);
      if (relatedService) {
        relatedServices.push(relatedService);
      }
    }
    return relatedServices;
  }

  async createService(insertService: InsertService): Promise<Service> {
    const id = await this.getNextId('services');
    const now = new Date();
    const service: Service = { 
      ...insertService,
      id,
      createdAt: now
    };
    await this.client.upload_from_text(`services/${id}.json`, JSON.stringify(service));
    return service;
  }

  async updateService(id: number, serviceUpdate: Partial<InsertService>): Promise<Service | undefined> {
    const existingService = await this.getServiceById(id);
    if (!existingService) return undefined;

    const updatedService: Service = {
      ...existingService,
      ...serviceUpdate
    };
    await this.client.upload_from_text(`services/${id}.json`, JSON.stringify(updatedService));
    return updatedService;
  }

  async deleteService(id: number): Promise<boolean> {
    try {
      await this.client.delete(`services/${id}.json`);
      return true;
    } catch {
      return false;
    }
  }

  // Contact message operations
  async getContactMessages(): Promise<ContactMessage[]> {
    try {
      const messages: ContactMessage[] = [];
      const messageFiles = await this.client.list('contacts/');
      for (const file of messageFiles) {
        const data = await this.client.download_from_text(file);
        messages.push(JSON.parse(data));
      }
      return messages.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch {
      return [];
    }
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = await this.getNextId('contacts');
    const now = new Date();
    const message: ContactMessage = { 
      ...insertMessage,
      id,
      createdAt: now,
      read: false
    };
    await this.client.upload_from_text(`contacts/${id}.json`, JSON.stringify(message));
    return message;
  }

  async markContactMessageAsRead(id: number): Promise<ContactMessage | undefined> {
    const existingMessage = await this.getContactMessages();
    if (!existingMessage) return undefined;

    const message = existingMessage.find(m => m.id === id);
    if (!message) return undefined;

    const updatedMessage: ContactMessage = {
      ...message,
      read: true
    };
    await this.client.upload_from_text(`contacts/${id}.json`, JSON.stringify(updatedMessage));
    return updatedMessage;
  }

  async deleteContactMessage(id: number): Promise<boolean> {
    try {
      await this.client.delete(`contacts/${id}.json`);
      return true;
    } catch {
      return false;
    }
  }
}

export const storage = new CloudStorage();