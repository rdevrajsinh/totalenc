import { Pool } from 'pg';
import { 
  users, type User, type InsertUser,
  blogPosts, type BlogPost, type InsertBlogPost,
  products, type Product, type InsertProduct,
  services, type Service, type InsertService,
  contactMessages, type ContactMessage, type InsertContactMessage,
} from "@shared/schema";
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';

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

export class PostgresStorage implements IStorage {
  private db: ReturnType<typeof drizzle>;

  constructor() {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL
    });
    this.db = drizzle(pool);
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const results = await this.db.select().from(users).where(eq(users.id, id));
    return results[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const results = await this.db.select().from(users).where(eq(users.username, username));
    return results[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const results = await this.db.insert(users).values(user).returning();
    return results[0];
  }

  // Blog operations
  async getBlogPosts(): Promise<BlogPost[]> {
    return await this.db.select().from(blogPosts).orderBy(blogPosts.publishDate);
  }

  async getBlogPostById(id: number): Promise<BlogPost | undefined> {
    const results = await this.db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return results[0];
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const results = await this.db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return results[0];
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const results = await this.db.insert(blogPosts).values(post).returning();
    return results[0];
  }

  async updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const results = await this.db.update(blogPosts).set(post).where(eq(blogPosts.id, id)).returning();
    return results[0];
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    const results = await this.db.delete(blogPosts).where(eq(blogPosts.id, id)).returning();
    return results.length > 0;
  }

  // Product operations
  async getProducts(): Promise<Product[]> {
    return await this.db.select().from(products);
  }

  async getProductById(id: number): Promise<Product | undefined> {
    const results = await this.db.select().from(products).where(eq(products.id, id));
    return results[0];
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const results = await this.db.select().from(products).where(eq(products.slug, slug));
    return results[0];
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return await this.db.select().from(products).where(eq(products.featured, true));
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const results = await this.db.insert(products).values(product).returning();
    return results[0];
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const results = await this.db.update(products).set(product).where(eq(products.id, id)).returning();
    return results[0];
  }

  async deleteProduct(id: number): Promise<boolean> {
    const results = await this.db.delete(products).where(eq(products.id, id)).returning();
    return results.length > 0;
  }

  // Service operations
  async getServices(): Promise<Service[]> {
    return await this.db.select().from(services);
  }

  async getServiceById(id: number): Promise<Service | undefined> {
    const results = await this.db.select().from(services).where(eq(services.id, id));
    return results[0];
  }

  async getServiceBySlug(slug: string): Promise<Service | undefined> {
    const results = await this.db.select().from(services).where(eq(services.slug, slug));
    return results[0];
  }

  async getFeaturedServices(): Promise<Service[]> {
    return await this.db.select().from(services).where(eq(services.featured, true));
  }

  async getServicesByParentId(parentId: number | null): Promise<Service[]> {
    return await this.db.select().from(services).where(eq(services.parentId, parentId));
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
    if (!service?.relatedServices?.length) return [];

    const relatedServices: Service[] = [];
    for (const relatedId of service.relatedServices) {
      const related = await this.getServiceById(relatedId);
      if (related) relatedServices.push(related);
    }
    return relatedServices;
  }

  async createService(service: InsertService): Promise<Service> {
    const results = await this.db.insert(services).values(service).returning();
    return results[0];
  }

  async updateService(id: number, service: Partial<InsertService>): Promise<Service | undefined> {
    const results = await this.db.update(services).set(service).where(eq(services.id, id)).returning();
    return results[0];
  }

  async deleteService(id: number): Promise<boolean> {
    const results = await this.db.delete(services).where(eq(services.id, id)).returning();
    return results.length > 0;
  }

  // Contact operations
  async getContactMessages(): Promise<ContactMessage[]> {
    return await this.db.select().from(contactMessages).orderBy(contactMessages.createdAt);
  }

  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const results = await this.db.insert(contactMessages).values(message).returning();
    return results[0];
  }

  async markContactMessageAsRead(id: number): Promise<ContactMessage | undefined> {
    const results = await this.db.update(contactMessages)
      .set({ read: true })
      .where(eq(contactMessages.id, id))
      .returning();
    return results[0];
  }

  async deleteContactMessage(id: number): Promise<boolean> {
    const results = await this.db.delete(contactMessages).where(eq(contactMessages.id, id)).returning();
    return results.length > 0;
  }
}

export const storage = new PostgresStorage();