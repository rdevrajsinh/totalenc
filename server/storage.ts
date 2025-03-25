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
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, service: Partial<InsertService>): Promise<Service | undefined>;
  deleteService(id: number): Promise<boolean>;
  
  // Contact message operations
  getContactMessages(): Promise<ContactMessage[]>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  markContactMessageAsRead(id: number): Promise<ContactMessage | undefined>;
  deleteContactMessage(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private blogPosts: Map<number, BlogPost>;
  private products: Map<number, Product>;
  private services: Map<number, Service>;
  private contactMessages: Map<number, ContactMessage>;
  
  currentId: number;
  currentBlogId: number;
  currentProductId: number;
  currentServiceId: number;
  currentContactId: number;

  constructor() {
    this.users = new Map();
    this.blogPosts = new Map();
    this.products = new Map();
    this.services = new Map();
    this.contactMessages = new Map();
    
    this.currentId = 1;
    this.currentBlogId = 1;
    this.currentProductId = 1;
    this.currentServiceId = 1;
    this.currentContactId = 1;
    
    // Initialize with sample data
    this.initSampleData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Blog operations
  async getBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
  }
  
  async getBlogPostById(id: number): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }
  
  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find(
      (post) => post.slug === slug,
    );
  }
  
  async createBlogPost(insertBlogPost: InsertBlogPost): Promise<BlogPost> {
    const id = this.currentBlogId++;
    const now = new Date();
    const blogPost: BlogPost = { 
      ...insertBlogPost,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.blogPosts.set(id, blogPost);
    return blogPost;
  }
  
  async updateBlogPost(id: number, blogPostUpdate: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const existingPost = this.blogPosts.get(id);
    if (!existingPost) return undefined;
    
    const updatedPost: BlogPost = {
      ...existingPost,
      ...blogPostUpdate,
      updatedAt: new Date()
    };
    this.blogPosts.set(id, updatedPost);
    return updatedPost;
  }
  
  async deleteBlogPost(id: number): Promise<boolean> {
    return this.blogPosts.delete(id);
  }
  
  // Product operations
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }
  
  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(
      (product) => product.slug === slug,
    );
  }
  
  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.featured);
  }
  
  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const now = new Date();
    const product: Product = { 
      ...insertProduct,
      id,
      createdAt: now
    };
    this.products.set(id, product);
    return product;
  }
  
  async updateProduct(id: number, productUpdate: Partial<InsertProduct>): Promise<Product | undefined> {
    const existingProduct = this.products.get(id);
    if (!existingProduct) return undefined;
    
    const updatedProduct: Product = {
      ...existingProduct,
      ...productUpdate
    };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }
  
  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }
  
  // Service operations
  async getServices(): Promise<Service[]> {
    return Array.from(this.services.values());
  }
  
  async getServiceById(id: number): Promise<Service | undefined> {
    return this.services.get(id);
  }
  
  async getServiceBySlug(slug: string): Promise<Service | undefined> {
    return Array.from(this.services.values()).find(
      (service) => service.slug === slug,
    );
  }
  
  async getFeaturedServices(): Promise<Service[]> {
    return Array.from(this.services.values()).filter(service => service.featured);
  }
  
  async createService(insertService: InsertService): Promise<Service> {
    const id = this.currentServiceId++;
    const now = new Date();
    const service: Service = { 
      ...insertService,
      id,
      createdAt: now
    };
    this.services.set(id, service);
    return service;
  }
  
  async updateService(id: number, serviceUpdate: Partial<InsertService>): Promise<Service | undefined> {
    const existingService = this.services.get(id);
    if (!existingService) return undefined;
    
    const updatedService: Service = {
      ...existingService,
      ...serviceUpdate
    };
    this.services.set(id, updatedService);
    return updatedService;
  }
  
  async deleteService(id: number): Promise<boolean> {
    return this.services.delete(id);
  }
  
  // Contact message operations
  async getContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = this.currentContactId++;
    const now = new Date();
    const message: ContactMessage = { 
      ...insertMessage,
      id,
      createdAt: now,
      read: false
    };
    this.contactMessages.set(id, message);
    return message;
  }
  
  async markContactMessageAsRead(id: number): Promise<ContactMessage | undefined> {
    const existingMessage = this.contactMessages.get(id);
    if (!existingMessage) return undefined;
    
    const updatedMessage: ContactMessage = {
      ...existingMessage,
      read: true
    };
    this.contactMessages.set(id, updatedMessage);
    return updatedMessage;
  }
  
  async deleteContactMessage(id: number): Promise<boolean> {
    return this.contactMessages.delete(id);
  }
  
  // Helper to initialize with sample data
  private initSampleData() {
    // Create admin user
    this.createUser({
      username: "admin",
      password: "admin123"
    });
    
    // Create sample services
    const serviceData: InsertService[] = [
      {
        name: "Standard Enclosures",
        slug: "standard-enclosures",
        description: "Our range of standard enclosures provide robust and reliable solutions for various industrial applications.",
        image: "/images/services/standard-enclosures.jpg",
        featured: true
      },
      {
        name: "Custom Solutions",
        slug: "custom-solutions",
        description: "We design and manufacture bespoke enclosure solutions tailored to your specific requirements and specifications.",
        image: "/images/services/custom-solutions.jpg",
        featured: true
      },
      {
        name: "Modification Services",
        slug: "modification-services",
        description: "Our comprehensive modification services include cutting, drilling, painting, and customizing existing enclosures.",
        image: "/images/services/modification-services.jpg",
        featured: true
      }
    ];
    
    serviceData.forEach(service => this.createService(service));
    
    // Create sample products
    const productData: InsertProduct[] = [
      {
        name: "Metal Enclosures",
        slug: "metal-enclosures",
        description: "Durable steel enclosures for industrial applications",
        image: "/images/products/metal-enclosures.jpg",
        category: "Enclosures",
        featured: true
      },
      {
        name: "Stainless Steel Cabinets",
        slug: "stainless-steel-cabinets",
        description: "Corrosion-resistant cabinets for harsh environments",
        image: "/images/products/stainless-steel-cabinets.jpg",
        category: "Cabinets",
        featured: true
      },
      {
        name: "Plastic Enclosures",
        slug: "plastic-enclosures",
        description: "Lightweight and versatile plastic enclosure options",
        image: "/images/products/plastic-enclosures.jpg",
        category: "Enclosures",
        featured: true
      },
      {
        name: "Custom Enclosures",
        slug: "custom-enclosures",
        description: "Bespoke solutions tailored to your specifications",
        image: "/images/products/custom-enclosures.jpg",
        category: "Custom",
        featured: true
      }
    ];
    
    productData.forEach(product => this.createProduct(product));
    
    // Create sample blog posts
    const blogData: InsertBlogPost[] = [
      {
        title: "Choosing the Right Enclosure for Your Industrial Application",
        slug: "choosing-right-enclosure",
        content: "<p>Learn about the key factors to consider when selecting an industrial enclosure for your specific needs and environment.</p><p>When it comes to selecting the right industrial enclosure, several factors must be taken into account to ensure optimal performance and longevity. Here are the key considerations:</p><h2>Environment Considerations</h2><p>The environment where your enclosure will be installed plays a crucial role in determining the appropriate material and IP rating:</p><ul><li>Indoor vs. Outdoor: For outdoor applications, weather-resistant materials and sealing are essential.</li><li>Temperature Extremes: Consider thermal management solutions for enclosures exposed to high or low temperatures.</li><li>Corrosive Environments: Chemical plants or coastal locations may require stainless steel or specially coated enclosures.</li></ul><h2>Size and Accessibility</h2><p>Proper sizing ensures that all components fit comfortably with adequate space for heat dissipation and maintenance:</p><ul><li>Future Expansion: Allow extra space for potential additions.</li><li>Accessibility: Consider how technicians will access the components for maintenance.</li><li>Cable Management: Ensure sufficient space for proper cable routing and organization.</li></ul><p>At Total Enclosures, we offer a wide range of solutions to meet your specific requirements. Contact our team of experts for personalized recommendations.</p>",
        excerpt: "Learn about the key factors to consider when selecting an industrial enclosure for your specific needs and environment.",
        author: "Admin",
        status: "published",
        publishDate: new Date("2023-01-15"),
        images: ["/images/blog/enclosure-selection.jpg"],
        categories: ["Industrial Solutions", "Best Practices"],
        tags: ["enclosures", "industrial", "selection guide"],
        metaTitle: "How to Choose the Right Industrial Enclosure | Total Enclosures",
        metaDescription: "Learn the essential factors to consider when selecting industrial enclosures for your specific application and environment. Expert guidance from Total Enclosures.",
      },
      {
        title: "The Benefits of Custom Enclosure Solutions",
        slug: "benefits-custom-enclosures",
        content: "<p>Discover how custom enclosure solutions can improve efficiency, reduce costs, and address your unique challenges.</p><p>While standard enclosures serve many applications well, custom solutions offer distinct advantages that can transform your operations:</p><h2>Perfect Fit for Your Equipment</h2><p>Custom enclosures are designed specifically for your equipment, ensuring:</p><ul><li>Optimal space utilization</li><li>Precise mounting points for your components</li><li>Integrated cable management tailored to your specific requirements</li></ul><h2>Enhanced Protection</h2><p>Custom solutions can provide targeted protection against specific environmental challenges:</p><ul><li>Specialized sealing for unique environmental conditions</li><li>Custom cooling or heating solutions for optimal temperature control</li><li>Reinforced protection in critical areas</li></ul><h2>Cost Efficiency</h2><p>While custom solutions may have higher upfront costs, they often provide long-term savings through:</p><ul><li>Reduced installation time and complexity</li><li>Minimized maintenance requirements</li><li>Extended equipment lifespan due to optimal protection</li></ul><p>At Total Enclosures, our engineering team works closely with you to develop custom solutions that perfectly match your requirements while maximizing value and performance.</p>",
        excerpt: "Discover how custom enclosure solutions can improve efficiency, reduce costs, and address your unique challenges.",
        author: "Admin",
        status: "published",
        publishDate: new Date("2023-02-20"),
        images: ["/images/blog/custom-enclosures.jpg"],
        categories: ["Custom Solutions", "Industry Insights"],
        tags: ["custom enclosures", "efficiency", "cost reduction"],
        metaTitle: "Benefits of Custom Industrial Enclosures | Total Enclosures",
        metaDescription: "Explore how custom enclosure solutions improve efficiency, reduce costs, and address unique industrial challenges. Expert solutions from Total Enclosures.",
      },
      {
        title: "Industry Trends: The Future of Industrial Enclosures",
        slug: "industry-trends-future",
        content: "<p>Stay ahead of the curve with our insights into the emerging trends and innovations in industrial enclosure technology.</p><p>The industrial enclosure sector is evolving rapidly, with several key trends shaping the future of the industry:</p><h2>Smart Enclosures</h2><p>The integration of IoT capabilities is transforming traditional enclosures into intelligent systems:</p><ul><li>Remote monitoring of environmental conditions inside enclosures</li><li>Predictive maintenance alerts based on real-time data</li><li>Automated climate control systems that respond to changing conditions</li></ul><h2>Sustainable Materials and Manufacturing</h2><p>Environmental considerations are driving innovations in materials and processes:</p><ul><li>Recycled and recyclable materials for enclosure construction</li><li>Energy-efficient manufacturing processes</li><li>Designs that facilitate end-of-life recycling</li></ul><h2>Modular and Scalable Designs</h2><p>Flexibility is becoming increasingly important in industrial applications:</p><ul><li>Standardized connectivity between modular components</li><li>Easily expandable systems that grow with your needs</li><li>Configurable internal arrangements that adapt to changing requirements</li></ul><p>At Total Enclosures, we continuously invest in research and development to incorporate these emerging trends into our product offerings, ensuring that our customers benefit from the latest innovations in enclosure technology.</p>",
        excerpt: "Stay ahead of the curve with our insights into the emerging trends and innovations in industrial enclosure technology.",
        author: "Admin",
        status: "published",
        publishDate: new Date("2023-03-08"),
        images: ["/images/blog/future-trends.jpg"],
        categories: ["Industry Trends", "Innovation"],
        tags: ["trends", "innovation", "future technology", "smart enclosures"],
        metaTitle: "Future Trends in Industrial Enclosure Technology | Total Enclosures",
        metaDescription: "Discover emerging trends and innovations in industrial enclosure technology, including smart systems, sustainable materials, and modular designs. Insights from Total Enclosures.",
      }
    ];
    
    blogData.forEach(blog => this.createBlogPost(blog));
  }
}

export const storage = new MemStorage();
