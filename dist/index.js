// server/index.ts
import express3 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  users;
  blogPosts;
  products;
  services;
  contactMessages;
  currentId;
  currentBlogId;
  currentProductId;
  currentServiceId;
  currentContactId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.blogPosts = /* @__PURE__ */ new Map();
    this.products = /* @__PURE__ */ new Map();
    this.services = /* @__PURE__ */ new Map();
    this.contactMessages = /* @__PURE__ */ new Map();
    this.currentId = 1;
    this.currentBlogId = 1;
    this.currentProductId = 1;
    this.currentServiceId = 1;
    this.currentContactId = 1;
    this.initSampleData().catch((err) => {
      console.error("Error initializing sample data:", err);
    });
  }
  // User operations
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = this.currentId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  // Blog operations
  async getBlogPosts() {
    return Array.from(this.blogPosts.values()).sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
  }
  async getBlogPostById(id) {
    return this.blogPosts.get(id);
  }
  async getBlogPostBySlug(slug) {
    return Array.from(this.blogPosts.values()).find(
      (post) => post.slug === slug
    );
  }
  async createBlogPost(insertBlogPost) {
    const id = this.currentBlogId++;
    const now = /* @__PURE__ */ new Date();
    const blogPost = {
      ...insertBlogPost,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.blogPosts.set(id, blogPost);
    return blogPost;
  }
  async updateBlogPost(id, blogPostUpdate) {
    const existingPost = this.blogPosts.get(id);
    if (!existingPost) return void 0;
    const updatedPost = {
      ...existingPost,
      ...blogPostUpdate,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.blogPosts.set(id, updatedPost);
    return updatedPost;
  }
  async deleteBlogPost(id) {
    return this.blogPosts.delete(id);
  }
  // Product operations
  async getProducts() {
    return Array.from(this.products.values());
  }
  async getProductById(id) {
    return this.products.get(id);
  }
  async getProductBySlug(slug) {
    return Array.from(this.products.values()).find(
      (product) => product.slug === slug
    );
  }
  async getFeaturedProducts() {
    return Array.from(this.products.values()).filter((product) => product.featured);
  }
  async createProduct(insertProduct) {
    const id = this.currentProductId++;
    const now = /* @__PURE__ */ new Date();
    const product = {
      ...insertProduct,
      id,
      createdAt: now
    };
    this.products.set(id, product);
    return product;
  }
  async updateProduct(id, productUpdate) {
    const existingProduct = this.products.get(id);
    if (!existingProduct) return void 0;
    const updatedProduct = {
      ...existingProduct,
      ...productUpdate
    };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }
  async deleteProduct(id) {
    return this.products.delete(id);
  }
  // Service operations
  async getServices() {
    return Array.from(this.services.values());
  }
  async getServiceById(id) {
    return this.services.get(id);
  }
  async getServiceBySlug(slug) {
    return Array.from(this.services.values()).find(
      (service) => service.slug === slug
    );
  }
  async getFeaturedServices() {
    return Array.from(this.services.values()).filter((service) => service.featured);
  }
  async getServicesByParentId(parentId) {
    return Array.from(this.services.values()).filter((service) => {
      if (parentId === null) {
        return service.parentId === void 0 || service.parentId === null;
      }
      return service.parentId === parentId;
    }).sort((a, b) => (a.order || 0) - (b.order || 0));
  }
  async getServiceHierarchy() {
    const mainServices = await this.getServicesByParentId(null);
    for (const service of mainServices) {
      const children = await this.getServicesByParentId(service.id);
      service.children = children;
    }
    return mainServices;
  }
  async getRelatedServices(serviceId) {
    const service = await this.getServiceById(serviceId);
    if (!service || !service.relatedServices || !Array.isArray(service.relatedServices)) {
      return [];
    }
    const relatedServices = [];
    for (const relatedId of service.relatedServices) {
      const relatedService = await this.getServiceById(relatedId);
      if (relatedService) {
        relatedServices.push(relatedService);
      }
    }
    return relatedServices;
  }
  async createService(insertService) {
    const id = this.currentServiceId++;
    const now = /* @__PURE__ */ new Date();
    const service = {
      ...insertService,
      id,
      createdAt: now
    };
    this.services.set(id, service);
    return service;
  }
  async updateService(id, serviceUpdate) {
    const existingService = this.services.get(id);
    if (!existingService) return void 0;
    const updatedService = {
      ...existingService,
      ...serviceUpdate
    };
    this.services.set(id, updatedService);
    return updatedService;
  }
  async deleteService(id) {
    return this.services.delete(id);
  }
  // Contact message operations
  async getContactMessages() {
    return Array.from(this.contactMessages.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  async createContactMessage(insertMessage) {
    const id = this.currentContactId++;
    const now = /* @__PURE__ */ new Date();
    const message = {
      ...insertMessage,
      id,
      createdAt: now,
      read: false
    };
    this.contactMessages.set(id, message);
    return message;
  }
  async markContactMessageAsRead(id) {
    const existingMessage = this.contactMessages.get(id);
    if (!existingMessage) return void 0;
    const updatedMessage = {
      ...existingMessage,
      read: true
    };
    this.contactMessages.set(id, updatedMessage);
    return updatedMessage;
  }
  async deleteContactMessage(id) {
    return this.contactMessages.delete(id);
  }
  // Helper to initialize with sample data
  async initSampleData() {
    this.createUser({
      username: "admin",
      password: "admin123"
    });
    const mainServices = [
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
    const createdMainServices = await Promise.all(
      mainServices.map(async (service) => await this.createService(service))
    );
    const standardEnclosuresId = createdMainServices[0].id;
    const standardSubServices = [
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
    const customSolutionsId = createdMainServices[1].id;
    const customSubServices = [
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
    const modificationServicesId = createdMainServices[2].id;
    const modificationSubServices = [
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
    await Promise.all([
      ...standardSubServices.map((service) => this.createService(service)),
      ...customSubServices.map((service) => this.createService(service)),
      ...modificationSubServices.map((service) => this.createService(service))
    ]);
    const productData = [
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
    productData.forEach((product) => this.createProduct(product));
    const blogData = [
      {
        title: "Choosing the Right Enclosure for Your Industrial Application",
        slug: "choosing-right-enclosure",
        content: "<p>Learn about the key factors to consider when selecting an industrial enclosure for your specific needs and environment.</p><p>When it comes to selecting the right industrial enclosure, several factors must be taken into account to ensure optimal performance and longevity. Here are the key considerations:</p><h2>Environment Considerations</h2><p>The environment where your enclosure will be installed plays a crucial role in determining the appropriate material and IP rating:</p><ul><li>Indoor vs. Outdoor: For outdoor applications, weather-resistant materials and sealing are essential.</li><li>Temperature Extremes: Consider thermal management solutions for enclosures exposed to high or low temperatures.</li><li>Corrosive Environments: Chemical plants or coastal locations may require stainless steel or specially coated enclosures.</li></ul><h2>Size and Accessibility</h2><p>Proper sizing ensures that all components fit comfortably with adequate space for heat dissipation and maintenance:</p><ul><li>Future Expansion: Allow extra space for potential additions.</li><li>Accessibility: Consider how technicians will access the components for maintenance.</li><li>Cable Management: Ensure sufficient space for proper cable routing and organization.</li></ul><p>At Total Enclosures, we offer a wide range of solutions to meet your specific requirements. Contact our team of experts for personalized recommendations.</p>",
        excerpt: "Learn about the key factors to consider when selecting an industrial enclosure for your specific needs and environment.",
        author: "Admin",
        status: "published",
        publishDate: /* @__PURE__ */ new Date("2023-01-15"),
        images: ["/images/blog/enclosure-selection.jpg"],
        categories: ["Industrial Solutions", "Best Practices"],
        tags: ["enclosures", "industrial", "selection guide"],
        metaTitle: "How to Choose the Right Industrial Enclosure | Total Enclosures",
        metaDescription: "Learn the essential factors to consider when selecting industrial enclosures for your specific application and environment. Expert guidance from Total Enclosures."
      },
      {
        title: "The Benefits of Custom Enclosure Solutions",
        slug: "benefits-custom-enclosures",
        content: "<p>Discover how custom enclosure solutions can improve efficiency, reduce costs, and address your unique challenges.</p><p>While standard enclosures serve many applications well, custom solutions offer distinct advantages that can transform your operations:</p><h2>Perfect Fit for Your Equipment</h2><p>Custom enclosures are designed specifically for your equipment, ensuring:</p><ul><li>Optimal space utilization</li><li>Precise mounting points for your components</li><li>Integrated cable management tailored to your specific requirements</li></ul><h2>Enhanced Protection</h2><p>Custom solutions can provide targeted protection against specific environmental challenges:</p><ul><li>Specialized sealing for unique environmental conditions</li><li>Custom cooling or heating solutions for optimal temperature control</li><li>Reinforced protection in critical areas</li></ul><h2>Cost Efficiency</h2><p>While custom solutions may have higher upfront costs, they often provide long-term savings through:</p><ul><li>Reduced installation time and complexity</li><li>Minimized maintenance requirements</li><li>Extended equipment lifespan due to optimal protection</li></ul><p>At Total Enclosures, our engineering team works closely with you to develop custom solutions that perfectly match your requirements while maximizing value and performance.</p>",
        excerpt: "Discover how custom enclosure solutions can improve efficiency, reduce costs, and address your unique challenges.",
        author: "Admin",
        status: "published",
        publishDate: /* @__PURE__ */ new Date("2023-02-20"),
        images: ["/images/blog/custom-enclosures.jpg"],
        categories: ["Custom Solutions", "Industry Insights"],
        tags: ["custom enclosures", "efficiency", "cost reduction"],
        metaTitle: "Benefits of Custom Industrial Enclosures | Total Enclosures",
        metaDescription: "Explore how custom enclosure solutions improve efficiency, reduce costs, and address unique industrial challenges. Expert solutions from Total Enclosures."
      },
      {
        title: "Industry Trends: The Future of Industrial Enclosures",
        slug: "industry-trends-future",
        content: "<p>Stay ahead of the curve with our insights into the emerging trends and innovations in industrial enclosure technology.</p><p>The industrial enclosure sector is evolving rapidly, with several key trends shaping the future of the industry:</p><h2>Smart Enclosures</h2><p>The integration of IoT capabilities is transforming traditional enclosures into intelligent systems:</p><ul><li>Remote monitoring of environmental conditions inside enclosures</li><li>Predictive maintenance alerts based on real-time data</li><li>Automated climate control systems that respond to changing conditions</li></ul><h2>Sustainable Materials and Manufacturing</h2><p>Environmental considerations are driving innovations in materials and processes:</p><ul><li>Recycled and recyclable materials for enclosure construction</li><li>Energy-efficient manufacturing processes</li><li>Designs that facilitate end-of-life recycling</li></ul><h2>Modular and Scalable Designs</h2><p>Flexibility is becoming increasingly important in industrial applications:</p><ul><li>Standardized connectivity between modular components</li><li>Easily expandable systems that grow with your needs</li><li>Configurable internal arrangements that adapt to changing requirements</li></ul><p>At Total Enclosures, we continuously invest in research and development to incorporate these emerging trends into our product offerings, ensuring that our customers benefit from the latest innovations in enclosure technology.</p>",
        excerpt: "Stay ahead of the curve with our insights into the emerging trends and innovations in industrial enclosure technology.",
        author: "Admin",
        status: "published",
        publishDate: /* @__PURE__ */ new Date("2023-03-08"),
        images: ["/images/blog/future-trends.jpg"],
        categories: ["Industry Trends", "Innovation"],
        tags: ["trends", "innovation", "future technology", "smart enclosures"],
        metaTitle: "Future Trends in Industrial Enclosure Technology | Total Enclosures",
        metaDescription: "Discover emerging trends and innovations in industrial enclosure technology, including smart systems, sustainable materials, and modular designs. Insights from Total Enclosures."
      }
    ];
    blogData.forEach((blog) => this.createBlogPost(blog));
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { pgTable, text, serial, integer, timestamp, json, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  author: text("author").default("Admin"),
  status: text("status").default("draft"),
  publishDate: timestamp("publish_date").defaultNow(),
  images: json("images").$type().default([]),
  categories: json("categories").$type().default([]),
  tags: json("tags").$type().default([]),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  image: text("image"),
  category: text("category"),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow()
});
var insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true
});
var services = pgTable("services", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  fullDescription: text("full_description"),
  // Detailed content for service page
  image: text("image"),
  featured: boolean("featured").default(false),
  parentId: integer("parent_id"),
  // For hierarchical structure: null for main services, populated for sub-services
  order: integer("order").default(0),
  // For ordering services on the page
  features: json("features").$type().default([]),
  // Key features of this service
  benefits: json("benefits").$type().default([]),
  // Benefits of this service
  applications: json("applications").$type().default([]),
  // Where this service/product applies
  specifications: json("specifications").$type().default({}),
  // Technical specs as key-value pairs
  relatedServices: json("related_services").$type().default([]),
  // IDs of related services
  metaTitle: text("meta_title"),
  // SEO meta title
  metaDescription: text("meta_description"),
  // SEO meta description
  createdAt: timestamp("created_at").defaultNow()
});
var insertServiceSchema = createInsertSchema(services).omit({
  id: true,
  createdAt: true
});
var contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  read: boolean("read").default(false)
});
var insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true,
  read: true
});

// server/routes.ts
import multer from "multer";
import path from "path";
import fs from "fs";
import { z } from "zod";
import express from "express";
var upload = multer({
  storage: multer.diskStorage({
    destination: function(req, file, cb) {
      const uploadPath = path.resolve(process.cwd(), "dist/public/uploads");
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: function(req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    }
  }),
  fileFilter: function(req, file, callback) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return callback(new Error("Only image files are allowed!"), false);
    }
    callback(null, true);
  }
});
async function registerRoutes(app2) {
  app2.get("/api/health", (req, res) => {
    res.status(200).json({ status: "healthy" });
  });
  app2.get("/api/blogs", async (req, res) => {
    try {
      const blogs = await storage.getBlogPosts();
      res.json(blogs);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      res.status(500).json({ message: "Failed to fetch blogs" });
    }
  });
  app2.get("/api/blogs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        const blogBySlug = await storage.getBlogPostBySlug(req.params.id);
        if (!blogBySlug) {
          return res.status(404).json({ message: "Blog post not found" });
        }
        return res.json(blogBySlug);
      }
      const blog = await storage.getBlogPostById(id);
      if (!blog) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(blog);
    } catch (error) {
      console.error("Error fetching blog:", error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });
  app2.post("/api/blogs", async (req, res) => {
    try {
      const data = {
        ...req.body,
        publishDate: req.body.publishDate ? new Date(req.body.publishDate) : /* @__PURE__ */ new Date()
      };
      const validatedData = insertBlogPostSchema.parse(data);
      const newBlog = await storage.createBlogPost(validatedData);
      res.status(201).json(newBlog);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error creating blog:", error);
      res.status(500).json({ message: "Failed to create blog post" });
    }
  });
  app2.put("/api/blogs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid blog ID" });
      }
      const validatedData = insertBlogPostSchema.partial().parse(req.body);
      const updatedBlog = await storage.updateBlogPost(id, validatedData);
      if (!updatedBlog) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(updatedBlog);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error updating blog:", error);
      res.status(500).json({ message: "Failed to update blog post" });
    }
  });
  app2.delete("/api/blogs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid blog ID" });
      }
      const success = await storage.deleteBlogPost(id);
      if (!success) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting blog:", error);
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });
  app2.post("/api/upload", upload.array("images", 5), (req, res) => {
    try {
      const files = req.files;
      if (!files || files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }
      const fileUrls = files.map((file) => {
        const relativePath = file.path.split("public")[1].replace(/\\/g, "/");
        return relativePath;
      });
      res.status(201).json({ urls: fileUrls });
    } catch (error) {
      console.error("Error uploading images:", error);
      res.status(500).json({ message: "Failed to upload images" });
    }
  });
  app2.get("/api/products", async (req, res) => {
    try {
      const products2 = await storage.getProducts();
      res.json(products2);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });
  app2.get("/api/products/featured", async (req, res) => {
    try {
      const products2 = await storage.getFeaturedProducts();
      res.json(products2);
    } catch (error) {
      console.error("Error fetching featured products:", error);
      res.status(500).json({ message: "Failed to fetch featured products" });
    }
  });
  app2.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        const productBySlug = await storage.getProductBySlug(req.params.id);
        if (!productBySlug) {
          return res.status(404).json({ message: "Product not found" });
        }
        return res.json(productBySlug);
      }
      const product = await storage.getProductById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });
  app2.get("/api/services", async (req, res) => {
    try {
      const services2 = await storage.getServices();
      res.json(services2);
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });
  app2.get("/api/services/featured", async (req, res) => {
    try {
      const services2 = await storage.getFeaturedServices();
      res.json(services2);
    } catch (error) {
      console.error("Error fetching featured services:", error);
      res.status(500).json({ message: "Failed to fetch featured services" });
    }
  });
  app2.get("/api/services/hierarchy", async (req, res) => {
    try {
      const serviceHierarchy = await storage.getServiceHierarchy();
      res.json(serviceHierarchy);
    } catch (error) {
      console.error("Error fetching service hierarchy:", error);
      res.status(500).json({ message: "Failed to fetch service hierarchy" });
    }
  });
  app2.get("/api/services/parent/:parentId", async (req, res) => {
    try {
      const parentId = req.params.parentId === "null" ? null : parseInt(req.params.parentId);
      if (req.params.parentId !== "null" && isNaN(parentId)) {
        return res.status(400).json({ message: "Invalid parent ID" });
      }
      const subServices = await storage.getServicesByParentId(parentId);
      res.json(subServices);
    } catch (error) {
      console.error("Error fetching sub-services:", error);
      res.status(500).json({ message: "Failed to fetch sub-services" });
    }
  });
  app2.get("/api/services/:id/related", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid service ID" });
      }
      const relatedServices = await storage.getRelatedServices(id);
      res.json(relatedServices);
    } catch (error) {
      console.error("Error fetching related services:", error);
      res.status(500).json({ message: "Failed to fetch related services" });
    }
  });
  app2.get("/api/services/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        const serviceBySlug = await storage.getServiceBySlug(req.params.id);
        if (!serviceBySlug) {
          return res.status(404).json({ message: "Service not found" });
        }
        const subServices2 = await storage.getServicesByParentId(serviceBySlug.id);
        const serviceData2 = {
          ...serviceBySlug,
          subServices: subServices2.length > 0 ? subServices2 : void 0
        };
        return res.json(serviceData2);
      }
      const service = await storage.getServiceById(id);
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
      const subServices = await storage.getServicesByParentId(service.id);
      const serviceData = {
        ...service,
        subServices: subServices.length > 0 ? subServices : void 0
      };
      res.json(serviceData);
    } catch (error) {
      console.error("Error fetching service:", error);
      res.status(500).json({ message: "Failed to fetch service" });
    }
  });
  app2.get("/api/media", (req, res) => {
    try {
      const uploadsPath = path.resolve(process.cwd(), "dist/public/uploads");
      if (!fs.existsSync(uploadsPath)) {
        fs.mkdirSync(uploadsPath, { recursive: true });
        return res.json([]);
      }
      const files = fs.readdirSync(uploadsPath);
      const mediaItems2 = files.map((filename, index) => {
        const filePath = path.join(uploadsPath, filename);
        const stats = fs.statSync(filePath);
        const relativePath = `/uploads/${filename}`;
        return {
          id: index + 1,
          name: filename,
          url: relativePath,
          type: path.extname(filename).toLowerCase() === ".png" ? "image/png" : path.extname(filename).toLowerCase() === ".gif" ? "image/gif" : "image/jpeg",
          size: stats.size,
          uploadedAt: stats.mtime
        };
      });
      res.json(mediaItems2);
    } catch (error) {
      console.error("Error fetching media:", error);
      res.status(500).json({ message: "Failed to fetch media items" });
    }
  });
  app2.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const newMessage = await storage.createContactMessage(validatedData);
      res.status(201).json({ success: true, message: "Message sent successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error sending contact message:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });
  let comments = [
    {
      id: 1,
      author: "John Smith",
      email: "john@example.com",
      content: "Great article! This has been very helpful for our industrial project.",
      blogPostId: 1,
      blogPostTitle: "Industry Trends: The Future of Industrial Enclosures",
      status: "approved",
      createdAt: new Date(Date.now() - 864e5 * 2)
      // 2 days ago
    },
    {
      id: 2,
      author: "Jane Doe",
      email: "jane@example.com",
      content: "I have a question about the specific applications. Do you have any examples for use in marine environments?",
      blogPostId: 1,
      blogPostTitle: "Industry Trends: The Future of Industrial Enclosures",
      status: "pending",
      createdAt: new Date(Date.now() - 864e5)
      // 1 day ago
    },
    {
      id: 3,
      author: "spam.bot",
      email: "spam@example.com",
      content: "Check out our discount prices at www.spam-example.com!",
      blogPostId: 2,
      blogPostTitle: "Custom Enclosure Solutions for Harsh Environments",
      status: "spam",
      createdAt: /* @__PURE__ */ new Date()
      // Today
    }
  ];
  let mediaItems = [];
  const initializeMediaItems = () => {
    const uploadsPath = path.resolve(process.cwd(), "dist/public/uploads");
    if (!fs.existsSync(uploadsPath)) {
      fs.mkdirSync(uploadsPath, { recursive: true });
      return;
    }
    try {
      const files = fs.readdirSync(uploadsPath);
      mediaItems = files.map((filename, index) => {
        const filePath = path.join(uploadsPath, filename);
        const stats = fs.statSync(filePath);
        const relativePath = `/uploads/${filename}`;
        return {
          id: index + 1,
          name: filename,
          url: relativePath,
          type: path.extname(filename).toLowerCase() === ".png" ? "image/png" : path.extname(filename).toLowerCase() === ".gif" ? "image/gif" : "image/jpeg",
          size: stats.size,
          uploadedAt: stats.mtime,
          status: "approved"
          // Default status for existing files
        };
      });
    } catch (error) {
      console.error("Error initializing media items:", error);
    }
  };
  initializeMediaItems();
  app2.get("/api/media", (req, res) => {
    res.json(mediaItems);
  });
  app2.get("/api/media/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid media ID" });
    }
    const mediaItem = mediaItems.find((item) => item.id === id);
    if (!mediaItem) {
      return res.status(404).json({ message: "Media item not found" });
    }
    res.json(mediaItem);
  });
  app2.patch("/api/media/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid media ID" });
    }
    const mediaIndex = mediaItems.findIndex((item) => item.id === id);
    if (mediaIndex === -1) {
      return res.status(404).json({ message: "Media item not found" });
    }
    const { name, status } = req.body;
    if (name) {
      mediaItems[mediaIndex].name = name;
    }
    if (status) {
      mediaItems[mediaIndex].status = status;
    }
    res.json(mediaItems[mediaIndex]);
  });
  app2.delete("/api/media/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid media ID" });
    }
    const mediaIndex = mediaItems.findIndex((item) => item.id === id);
    if (mediaIndex === -1) {
      return res.status(404).json({ message: "Media item not found" });
    }
    const mediaItem = mediaItems[mediaIndex];
    const filePath = path.resolve(process.cwd(), "dist/public" + mediaItem.url);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (error) {
        console.error("Error deleting file:", error);
        return res.status(500).json({ message: "Failed to delete file from filesystem" });
      }
    }
    mediaItems = mediaItems.filter((item) => item.id !== id);
    res.json({ success: true });
  });
  app2.get("/api/comments", (req, res) => {
    res.json(comments);
  });
  app2.get("/api/comments/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid comment ID" });
    }
    const comment = comments.find((c) => c.id === id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.json(comment);
  });
  app2.post("/api/comments/:id/approve", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid comment ID" });
    }
    const commentIndex = comments.findIndex((c) => c.id === id);
    if (commentIndex === -1) {
      return res.status(404).json({ message: "Comment not found" });
    }
    comments[commentIndex].status = "approved";
    res.json({ success: true, comment: comments[commentIndex] });
  });
  app2.post("/api/comments/:id/reject", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid comment ID" });
    }
    const commentIndex = comments.findIndex((c) => c.id === id);
    if (commentIndex === -1) {
      return res.status(404).json({ message: "Comment not found" });
    }
    comments[commentIndex].status = "spam";
    res.json({ success: true, comment: comments[commentIndex] });
  });
  app2.delete("/api/comments/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid comment ID" });
    }
    const commentIndex = comments.findIndex((c) => c.id === id);
    if (commentIndex === -1) {
      return res.status(404).json({ message: "Comment not found" });
    }
    comments = comments.filter((c) => c.id !== id);
    res.json({ success: true });
  });
  app2.post("/api/auth/login", async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      res.json({
        id: user.id,
        username: user.username,
        token: "demo-token"
        // In a real app, generate a JWT token
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Authentication failed" });
    }
  });
  app2.use(express.json());
  app2.use("/uploads", express.static("dist/public/uploads"));
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express2 from "express";
import fs2 from "fs";
import path3, { dirname as dirname2 } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path2, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path2.resolve(__dirname, "client", "src"),
      "@shared": path2.resolve(__dirname, "shared")
    }
  },
  root: path2.resolve(__dirname, "client"),
  build: {
    outDir: path2.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname2(__filename2);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path3.resolve(
        __dirname2,
        "..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path3.resolve(__dirname2, "public");
  if (!fs2.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express2.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path3.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express3();
app.use(express3.json());
app.use(express3.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path4 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path4.startsWith("/api")) {
      let logLine = `${req.method} ${path4} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
