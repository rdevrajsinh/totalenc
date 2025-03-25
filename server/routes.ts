import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBlogPostSchema, insertContactMessageSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";
import { z } from "zod";
import express from 'express';

// Setup file upload with multer
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = path.resolve(process.cwd(), "dist/public/uploads");

      // Create directory if it doesn't exist
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    }
  }),
  fileFilter: function(req, file, callback) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return callback(new Error('Only image files are allowed!'), false);
    }
    callback(null, true);
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes
  app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "healthy" });
  });

  // Blog Routes
  app.get("/api/blogs", async (req, res) => {
    try {
      const blogs = await storage.getBlogPosts();
      res.json(blogs);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      res.status(500).json({ message: "Failed to fetch blogs" });
    }
  });

  app.get("/api/blogs/:id", async (req, res) => {
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

  app.post("/api/blogs", async (req, res) => {
    try {
      const data = {
        ...req.body,
        publishDate: req.body.publishDate ? new Date(req.body.publishDate) : new Date()
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

  app.put("/api/blogs/:id", async (req, res) => {
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

  app.delete("/api/blogs/:id", async (req, res) => {
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

  // Image Upload Route
  app.post("/api/upload", upload.array("images", 5), (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      const fileUrls = files.map(file => {
        const relativePath = file.path.split("public")[1].replace(/\\/g, "/");
        return relativePath;
      });

      res.status(201).json({ urls: fileUrls });
    } catch (error) {
      console.error("Error uploading images:", error);
      res.status(500).json({ message: "Failed to upload images" });
    }
  });

  // Products Routes
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/featured", async (req, res) => {
    try {
      const products = await storage.getFeaturedProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching featured products:", error);
      res.status(500).json({ message: "Failed to fetch featured products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
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

  // Services Routes
  app.get("/api/services", async (req, res) => {
    try {
      const services = await storage.getServices();
      res.json(services);
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  app.get("/api/services/featured", async (req, res) => {
    try {
      const services = await storage.getFeaturedServices();
      res.json(services);
    } catch (error) {
      console.error("Error fetching featured services:", error);
      res.status(500).json({ message: "Failed to fetch featured services" });
    }
  });

  app.get("/api/services/hierarchy", async (req, res) => {
    try {
      const serviceHierarchy = await storage.getServiceHierarchy();
      res.json(serviceHierarchy);
    } catch (error) {
      console.error("Error fetching service hierarchy:", error);
      res.status(500).json({ message: "Failed to fetch service hierarchy" });
    }
  });

  app.get("/api/services/parent/:parentId", async (req, res) => {
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

  app.get("/api/services/:id/related", async (req, res) => {
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

  app.get("/api/services/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        const serviceBySlug = await storage.getServiceBySlug(req.params.id);
        if (!serviceBySlug) {
          return res.status(404).json({ message: "Service not found" });
        }

        // Get sub-services if this is a parent service
        const subServices = await storage.getServicesByParentId(serviceBySlug.id);
        const serviceData = {
          ...serviceBySlug,
          subServices: subServices.length > 0 ? subServices : undefined
        };

        return res.json(serviceData);
      }

      const service = await storage.getServiceById(id);
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }

      // Get sub-services if this is a parent service
      const subServices = await storage.getServicesByParentId(service.id);
      const serviceData = {
        ...service,
        subServices: subServices.length > 0 ? subServices : undefined
      };

      res.json(serviceData);
    } catch (error) {
      console.error("Error fetching service:", error);
      res.status(500).json({ message: "Failed to fetch service" });
    }
  });

  // Media Routes
  app.get("/api/media", (req, res) => {
    try {
      // Scan the uploads directory
      const uploadsPath = path.resolve(process.cwd(), "dist/public/uploads");
      
      // Create directory if it doesn't exist (just in case)
      if (!fs.existsSync(uploadsPath)) {
        fs.mkdirSync(uploadsPath, { recursive: true });
        return res.json([]);  // Return empty array for a new directory
      }
      
      const files = fs.readdirSync(uploadsPath);
      const mediaItems = files.map((filename, index) => {
        const filePath = path.join(uploadsPath, filename);
        const stats = fs.statSync(filePath);
        const relativePath = `/uploads/${filename}`;
        
        return {
          id: index + 1,
          name: filename,
          url: relativePath,
          type: path.extname(filename).toLowerCase() === '.png' 
            ? 'image/png' 
            : path.extname(filename).toLowerCase() === '.gif'
              ? 'image/gif'
              : 'image/jpeg',
          size: stats.size,
          uploadedAt: stats.mtime
        };
      });
      
      res.json(mediaItems);
    } catch (error) {
      console.error("Error fetching media:", error);
      res.status(500).json({ message: "Failed to fetch media items" });
    }
  });

  // Contact Form Route
  app.post("/api/contact", async (req, res) => {
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

  // Comments API Routes
  // Mock comments database (would be in storage.ts in a real implementation)
  let comments = [
    {
      id: 1,
      author: "John Smith",
      email: "john@example.com",
      content: "Great article! This has been very helpful for our industrial project.",
      blogPostId: 1,
      blogPostTitle: "Industry Trends: The Future of Industrial Enclosures",
      status: "approved",
      createdAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
    },
    {
      id: 2,
      author: "Jane Doe",
      email: "jane@example.com",
      content: "I have a question about the specific applications. Do you have any examples for use in marine environments?",
      blogPostId: 1,
      blogPostTitle: "Industry Trends: The Future of Industrial Enclosures",
      status: "pending",
      createdAt: new Date(Date.now() - 86400000), // 1 day ago
    },
    {
      id: 3,
      author: "spam.bot",
      email: "spam@example.com",
      content: "Check out our discount prices at www.spam-example.com!",
      blogPostId: 2,
      blogPostTitle: "Custom Enclosure Solutions for Harsh Environments",
      status: "spam",
      createdAt: new Date(), // Today
    }
  ];
  
  // Media Management Routes
  // Media items with status for approval workflow
  let mediaItems = [];

  // Automatically add existing media from uploads directory to media items
  const initializeMediaItems = () => {
    const uploadsPath = path.resolve(process.cwd(), "dist/public/uploads");
    
    // Create directory if it doesn't exist
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
          type: path.extname(filename).toLowerCase() === '.png' 
            ? 'image/png' 
            : path.extname(filename).toLowerCase() === '.gif'
              ? 'image/gif'
              : 'image/jpeg',
          size: stats.size,
          uploadedAt: stats.mtime,
          status: 'approved' // Default status for existing files
        };
      });
    } catch (error) {
      console.error("Error initializing media items:", error);
    }
  };
  
  // Initialize media items
  initializeMediaItems();
  
  // Get all media items
  app.get("/api/media", (req, res) => {
    res.json(mediaItems);
  });
  
  // Get a single media item
  app.get("/api/media/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid media ID" });
    }
    
    const mediaItem = mediaItems.find(item => item.id === id);
    if (!mediaItem) {
      return res.status(404).json({ message: "Media item not found" });
    }
    
    res.json(mediaItem);
  });
  
  // Update a media item
  app.patch("/api/media/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid media ID" });
    }
    
    const mediaIndex = mediaItems.findIndex(item => item.id === id);
    if (mediaIndex === -1) {
      return res.status(404).json({ message: "Media item not found" });
    }
    
    const { name, status } = req.body;
    
    // Update only the provided fields
    if (name) {
      mediaItems[mediaIndex].name = name;
    }
    
    if (status) {
      mediaItems[mediaIndex].status = status;
    }
    
    res.json(mediaItems[mediaIndex]);
  });
  
  // Delete a media item
  app.delete("/api/media/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid media ID" });
    }
    
    const mediaIndex = mediaItems.findIndex(item => item.id === id);
    if (mediaIndex === -1) {
      return res.status(404).json({ message: "Media item not found" });
    }
    
    const mediaItem = mediaItems[mediaIndex];
    
    // Check if the file exists in the filesystem
    const filePath = path.resolve(process.cwd(), "dist/public" + mediaItem.url);
    if (fs.existsSync(filePath)) {
      try {
        // Delete the file from the filesystem
        fs.unlinkSync(filePath);
      } catch (error) {
        console.error("Error deleting file:", error);
        return res.status(500).json({ message: "Failed to delete file from filesystem" });
      }
    }
    
    // Remove the item from the array
    mediaItems = mediaItems.filter(item => item.id !== id);
    
    res.json({ success: true });
  });
  
  // Get all comments
  app.get("/api/comments", (req, res) => {
    res.json(comments);
  });
  
  // Get a single comment
  app.get("/api/comments/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid comment ID" });
    }
    
    const comment = comments.find(c => c.id === id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    
    res.json(comment);
  });
  
  // Approve a comment
  app.post("/api/comments/:id/approve", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid comment ID" });
    }
    
    const commentIndex = comments.findIndex(c => c.id === id);
    if (commentIndex === -1) {
      return res.status(404).json({ message: "Comment not found" });
    }
    
    comments[commentIndex].status = "approved";
    res.json({ success: true, comment: comments[commentIndex] });
  });
  
  // Reject a comment (mark as spam)
  app.post("/api/comments/:id/reject", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid comment ID" });
    }
    
    const commentIndex = comments.findIndex(c => c.id === id);
    if (commentIndex === -1) {
      return res.status(404).json({ message: "Comment not found" });
    }
    
    comments[commentIndex].status = "spam";
    res.json({ success: true, comment: comments[commentIndex] });
  });
  
  // Delete a comment
  app.delete("/api/comments/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid comment ID" });
    }
    
    const commentIndex = comments.findIndex(c => c.id === id);
    if (commentIndex === -1) {
      return res.status(404).json({ message: "Comment not found" });
    }
    
    comments = comments.filter(c => c.id !== id);
    res.json({ success: true });
  });
  
  // Auth route for admin (simplified for demo)
  app.post("/api/auth/login", async (req, res) => {
    const { username, password } = req.body;

    try {
      const user = await storage.getUserByUsername(username);

      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      res.json({
        id: user.id,
        username: user.username,
        token: "demo-token" // In a real app, generate a JWT token
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Authentication failed" });
    }
  });

  app.use(express.json());
  app.use('/uploads', express.static('dist/public/uploads'));

  const httpServer = createServer(app);
  return httpServer;
}