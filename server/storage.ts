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
  getServicesByParentId(parentId: number | null): Promise<Service[]>; // Get all child services 
  getServiceHierarchy(): Promise<Service[]>; // Get services with their children
  getRelatedServices(serviceId: number): Promise<Service[]>; // Get related services
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, service: Partial<InsertService>): Promise<Service | undefined>;
  deleteService(id: number): Promise<boolean>;
  
  // Contact message operations
  getContactMessages(): Promise<ContactMessage[]>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  markContactMessageAsRead(id: number): Promise<ContactMessage | undefined>;
  deleteContactMessage(id: number): Promise<boolean>;
}

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

export class PostgresStorage implements IStorage {
  private db: any;
  
  constructor() {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    this.db = drizzle(pool);
  
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
    
    // Initialize with sample data (using Promise to handle async operations)
    this.initSampleData().catch(err => {
      console.error("Error initializing sample data:", err);
    });
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
  
  async getServicesByParentId(parentId: number | null): Promise<Service[]> {
    return Array.from(this.services.values()).filter(service => {
      if (parentId === null) {
        return service.parentId === undefined || service.parentId === null;
      }
      return service.parentId === parentId;
    }).sort((a, b) => (a.order || 0) - (b.order || 0));
  }
  
  async getServiceHierarchy(): Promise<Service[]> {
    // Get all top-level services (no parentId)
    const mainServices = await this.getServicesByParentId(null);
    
    // For each main service, attach children
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
  private async initSampleData() {
    // Create admin user
    this.createUser({
      username: "admin",
      password: "admin123"
    });
    
    // Create main services
    const mainServices: InsertService[] = [
      {
        name: "Standard Enclosures",
        slug: "standard-enclosures",
        description: "Our range of standard enclosures provide robust and reliable solutions for various industrial applications.",
        fullDescription: "<p>Total Enclosures offers a comprehensive range of standard enclosures designed to meet diverse industrial needs. Our catalog includes various materials, sizes, and protection ratings to ensure you find the perfect solution for your application.</p><p>All our standard enclosures are manufactured to the highest quality standards and undergo rigorous testing to ensure reliability and durability in demanding environments.</p>",
        image: "/images/services/standard-enclosures.jpg",
        featured: true,
        order: 1,
        metaTitle: "Standard Industrial Enclosures | Total Enclosures",
        metaDescription: "Browse our comprehensive range of high-quality standard industrial enclosures including metal, stainless steel, and plastic options for various applications."
      },
      {
        name: "Custom Solutions",
        slug: "custom-solutions",
        description: "We design and manufacture bespoke enclosure solutions tailored to your specific requirements and specifications.",
        fullDescription: "<p>When standard enclosures don't meet your unique requirements, our custom solutions provide the perfect answer. We work closely with you to design and manufacture enclosures that precisely match your specifications.</p><p>Our engineering team combines innovative design with advanced manufacturing techniques to create custom enclosures that optimize functionality, aesthetics, and cost-effectiveness.</p>",
        image: "/images/services/custom-solutions.jpg",
        featured: true,
        order: 2,
        metaTitle: "Custom Enclosure Solutions | Total Enclosures",
        metaDescription: "Get custom-designed industrial enclosures tailored to your exact specifications. Our engineering team delivers bespoke solutions for unique applications."
      },
      {
        name: "Modification Services",
        slug: "modification-services",
        description: "Our comprehensive modification services include cutting, drilling, painting, and customizing existing enclosures.",
        fullDescription: "<p>Our comprehensive modification services transform standard enclosures to meet your specific requirements. Whether you need custom cutouts, special finishes, or additional features, our expert team delivers precise modifications that enhance functionality without compromising integrity.</p><p>We utilize state-of-the-art equipment and techniques to ensure that every modification is completed to exacting standards and tight tolerances.</p>",
        image: "/images/services/modification-services.jpg",
        featured: true,
        order: 3,
        metaTitle: "Enclosure Modification Services | Total Enclosures",
        metaDescription: "Professional modification services for industrial enclosures. Customize your enclosures with precision cutting, drilling, painting and more."
      }
    ];
    
    // Create the main services first
    const createdMainServices = await Promise.all(
      mainServices.map(async service => await this.createService(service))
    );
    
    // Create sub-services for Standard Enclosures
    const standardEnclosuresId = createdMainServices[0].id;
    const standardSubServices: InsertService[] = [
      {
        name: "Metal Enclosures",
        slug: "metal-enclosures",
        description: "Durable steel enclosures designed for industrial environments where strength and protection are essential.",
        fullDescription: "<p>Our metal enclosures provide superior protection for your equipment in demanding industrial environments. Manufactured from high-quality steel, these enclosures offer excellent durability, electromagnetic shielding, and resistance to impact.</p><p>Available in various sizes and configurations, our metal enclosures can be customized with different mounting options, access points, and surface finishes to meet your specific requirements.</p>",
        image: "/images/services/metal-enclosures.jpg",
        parentId: standardEnclosuresId,
        order: 1,
        features: [
          "Robust steel construction",
          "Various IP protection ratings available",
          "Optional powder coating for enhanced durability",
          "Multiple mounting options",
          "Available with different locking mechanisms"
        ],
        benefits: [
          "Superior protection against physical impact",
          "Excellent EMI/RFI shielding capabilities",
          "Long service life in industrial environments",
          "Cost-effective solution for harsh conditions",
          "Versatile mounting and installation options"
        ]
      },
      {
        name: "Stainless Steel Enclosures",
        slug: "stainless-steel-enclosures",
        description: "Corrosion-resistant enclosures ideal for food processing, pharmaceutical, and outdoor applications.",
        fullDescription: "<p>Our stainless steel enclosures provide exceptional corrosion resistance and hygienic properties, making them ideal for food processing, pharmaceutical, chemical, and outdoor applications. Manufactured from high-grade 304 or 316L stainless steel, these enclosures maintain their integrity even in the most challenging environments.</p><p>The smooth, easy-to-clean surfaces make these enclosures perfect for applications where regular sanitation is required, while their aesthetic appearance makes them suitable for visible installations.</p>",
        image: "/images/services/stainless-steel-enclosures.jpg",
        parentId: standardEnclosuresId,
        order: 2,
        features: [
          "304 or 316L stainless steel construction",
          "Seamless welded design options",
          "High IP rating for water and dust protection",
          "Brushed or polished finish options",
          "Food-grade silicone gaskets available"
        ],
        benefits: [
          "Exceptional corrosion resistance",
          "Suitable for washdown environments",
          "Meets hygiene requirements for food and pharmaceutical applications",
          "Aesthetic appearance for visible installations",
          "Extended service life in harsh environments"
        ]
      },
      {
        name: "Plastic Enclosures",
        slug: "plastic-enclosures",
        description: "Lightweight, non-conductive enclosures perfect for electrical applications and corrosive environments.",
        fullDescription: "<p>Our plastic enclosures offer lightweight, non-conductive solutions ideal for electrical applications and corrosive environments. Manufactured from high-quality ABS, polycarbonate, or fiberglass-reinforced polyester, these enclosures provide excellent insulation properties while resisting chemical damage.</p><p>Their inherent non-corrosive nature makes them perfect for outdoor installations, wastewater treatment facilities, and chemical processing plants. The transparent lid options allow for easy visual inspection without opening the enclosure.</p>",
        image: "/images/services/plastic-enclosures.jpg",
        parentId: standardEnclosuresId,
        order: 3,
        features: [
          "UV-resistant materials for outdoor use",
          "Non-conductive for electrical safety",
          "Chemical and corrosion resistant",
          "Transparent lid options available",
          "Lightweight for easy installation"
        ],
        benefits: [
          "Excellent electrical insulation properties",
          "No risk of corrosion in harsh environments",
          "Lower installation costs due to light weight",
          "UV-stabilized for extended outdoor service life",
          "Easy modification without specialized tools"
        ]
      }
    ];
    
    // Create sub-services for Custom Solutions
    const customSolutionsId = createdMainServices[1].id;
    const customSubServices: InsertService[] = [
      {
        name: "Custom Design Services",
        slug: "custom-design-services",
        description: "Expert engineering and design services to create the perfect enclosure for your unique requirements.",
        fullDescription: "<p>Our custom design services combine engineering expertise with innovative thinking to create enclosures that perfectly match your unique requirements. We begin with a thorough consultation to understand your needs, constraints, and objectives, then develop detailed designs that optimize functionality, aesthetics, and cost-effectiveness.</p><p>Our engineers utilize advanced CAD software to create precise 3D models and detailed technical drawings, allowing you to visualize and approve the design before manufacturing begins. We consider all aspects of your application, including environmental conditions, access requirements, thermal management, and regulatory compliance.</p>",
        image: "/images/services/custom-design.jpg",
        parentId: customSolutionsId,
        order: 1,
        features: [
          "Comprehensive consultation and requirements analysis",
          "Advanced 3D CAD design and modeling",
          "Thermal and structural simulation capabilities",
          "Prototype development and testing",
          "Complete documentation and manufacturing drawings"
        ],
        benefits: [
          "Enclosures precisely tailored to your application",
          "Optimization of space, weight, and cost",
          "Validation of performance before manufacturing",
          "Seamless integration with existing systems",
          "Solutions that address unique environmental challenges"
        ]
      },
      {
        name: "Specialized Materials",
        slug: "specialized-materials",
        description: "Enclosures manufactured from specialized materials for extreme environments and unique applications.",
        fullDescription: "<p>When standard materials aren't sufficient for your challenging application, our specialized materials service provides solutions that can withstand extreme environments. We work with a wide range of advanced materials including composite materials, high-performance alloys, specialty plastics, and custom laminates.</p><p>Whether you need extreme temperature resistance, exceptional chemical compatibility, specialized shielding properties, or ultra-lightweight construction, our engineering team selects and implements the perfect material solution for your enclosure requirements.</p>",
        image: "/images/services/specialized-materials.jpg",
        parentId: customSolutionsId,
        order: 2,
        features: [
          "High-temperature resistant alloys",
          "Composite materials for weight reduction",
          "Enhanced EMI/RFI shielding materials",
          "Specialty plastics for chemical resistance",
          "Antimicrobial materials for healthcare applications"
        ],
        benefits: [
          "Performance in extreme environmental conditions",
          "Resistance to specific chemicals or contaminants",
          "Extended service life in harsh applications",
          "Weight reduction without compromising strength",
          "Specialized protection for sensitive equipment"
        ]
      },
      {
        name: "OEM Integration Solutions",
        slug: "oem-integration-solutions",
        description: "Custom enclosures designed for seamless integration with your products and manufacturing processes.",
        fullDescription: "<p>Our OEM Integration Solutions are specifically designed for manufacturers who need enclosures that seamlessly integrate with their products and production processes. We develop custom enclosure solutions that not only protect your components but also enhance your product's functionality, appearance, and brand identity.</p><p>Working closely with your engineering and production teams, we develop enclosures that optimize assembly efficiency, reduce manufacturing costs, and improve the end-user experience. Whether you need a few hundred or thousands of units, we deliver consistent quality and reliable supply to support your production schedule.</p>",
        image: "/images/services/oem-integration.jpg",
        parentId: customSolutionsId,
        order: 3,
        features: [
          "Design for Manufacturing (DFM) approach",
          "Custom mounting and assembly features",
          "Integration of your branding elements",
          "Production-friendly design features",
          "Consistent quality across large production runs"
        ],
        benefits: [
          "Reduced assembly time and complexity",
          "Enhanced product aesthetics and functionality",
          "Optimized for your production processes",
          "Reliable supply chain for continuous production",
          "Potential cost reduction through design optimization"
        ]
      }
    ];
    
    // Create sub-services for Modification Services
    const modificationServicesId = createdMainServices[2].id;
    const modificationSubServices: InsertService[] = [
      {
        name: "CNC Machining",
        slug: "cnc-machining",
        description: "Precision CNC machining services for accurate cutouts, holes, and complex modifications.",
        fullDescription: "<p>Our precision CNC machining services transform standard enclosures with exact cutouts, holes, and complex modifications to accommodate your specific components. Using advanced CNC technology, we achieve tight tolerances and clean finishes that ensure perfect fit and professional appearance.</p><p>Our capabilities include multi-axis milling, drilling, tapping, and engraving across various materials including steel, aluminum, stainless steel, and plastics. Each modification is programmed from detailed technical drawings or digital files, ensuring precision and repeatability across multiple units.</p>",
        image: "/images/services/cnc-machining.jpg",
        parentId: modificationServicesId,
        order: 1,
        features: [
          "Precision cutouts for displays, connectors, and controls",
          "Exact hole patterns for mounting equipment",
          "Thread tapping for secure component attachment",
          "Countersunk holes for flush mounting",
          "Custom engraving for identification and branding"
        ],
        benefits: [
          "Perfect fit for your components and equipment",
          "Professional appearance with clean edges and precise dimensions",
          "Consistent results across multiple enclosures",
          "Complex modifications that would be difficult to achieve manually",
          "Reduced installation time with pre-modified enclosures"
        ]
      },
      {
        name: "Surface Finishing",
        slug: "surface-finishing",
        description: "Professional painting, powder coating, and specialized surface treatments for enclosures.",
        fullDescription: "<p>Our surface finishing services enhance the appearance, durability, and functionality of your enclosures. We offer a comprehensive range of treatments including painting, powder coating, anodizing, plating, and specialty coatings that provide both aesthetic appeal and protective benefits.</p><p>Whether you need a specific color for brand consistency, added corrosion protection, enhanced chemical resistance, or specialized properties like anti-static surfaces, our finishing processes deliver high-quality, long-lasting results that meet industry standards and your exact specifications.</p>",
        image: "/images/services/surface-finishing.jpg",
        parentId: modificationServicesId,
        order: 2,
        features: [
          "Custom color matching to your specifications",
          "Textured finishes for improved grip and appearance",
          "Chemical-resistant coatings for harsh environments",
          "Anti-static finishes for sensitive electronics",
          "UV-resistant treatments for outdoor applications"
        ],
        benefits: [
          "Enhanced aesthetic appearance and brand consistency",
          "Improved corrosion and chemical resistance",
          "Extended service life in challenging environments",
          "Specialized functionality like EMI shielding",
          "Improved cleanliness and maintenance properties"
        ]
      },
      {
        name: "Thermal Management",
        slug: "thermal-management",
        description: "Installation of cooling systems, vents, and thermal solutions to maintain optimal internal temperatures.",
        fullDescription: "<p>Our thermal management modifications ensure your sensitive equipment operates at optimal temperatures, preventing overheating and extending component life. We design and implement comprehensive cooling solutions including ventilation systems, fan installations, heat exchangers, air conditioning units, and passive cooling options.</p><p>Each thermal solution is engineered based on heat load calculations, ambient conditions, and equipment specifications to provide efficient temperature control while maintaining appropriate IP protection. Our installations include proper sealing, filtering, and condensation management to ensure reliable operation in various environments.</p>",
        image: "/images/services/thermal-management.jpg",
        parentId: modificationServicesId,
        order: 3,
        features: [
          "Filtered ventilation systems with appropriate IP protection",
          "Fan installation with temperature controllers",
          "Heat exchanger integration for sealed enclosures",
          "Air conditioning units for high heat loads",
          "Thermal analysis and heat load calculations"
        ],
        benefits: [
          "Prevention of equipment overheating and failure",
          "Extended component life through proper temperature control",
          "Maintained environmental protection while allowing cooling",
          "Energy-efficient solutions tailored to actual heat loads",
          "Reduced maintenance and downtime due to thermal issues"
        ]
      }
    ];
    
    // Create all sub-services
    await Promise.all([
      ...standardSubServices.map(service => this.createService(service)),
      ...customSubServices.map(service => this.createService(service)),
      ...modificationSubServices.map(service => this.createService(service))
    ]);
    
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
