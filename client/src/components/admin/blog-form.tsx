import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Blog, BlogFormData } from "@/lib/types";
import { useLocation } from "wouter";
import { slugify } from "@/lib/utils";
import ImageUpload from "./image-upload";
import MediaSelector from "./media-selector";
import SeoSettings from "./seo-settings";

// Form schema with validation
const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  content: z.string(), // No minimum validation to allow for HTML content with images
  excerpt: z.string().optional(),
  author: z.string().default("Admin"),
  status: z.enum(["draft", "published", "scheduled"]),
  publishDate: z.string(),
  images: z.array(z.string()).default([]),
  categories: z.array(z.string()).default([]),
  tags: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

interface BlogFormProps {
  blog?: Blog;
  isEditing?: boolean;
}

export default function BlogForm({ blog, isEditing = false }: BlogFormProps) {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const [content, setContent] = useState(blog?.content || "");
  const [uploadedImages, setUploadedImages] = useState<string[]>(blog?.images || []);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(blog?.categories || []);

  // Available categories (in a real app, this would come from an API)
  const availableCategories = [
    "Industrial Solutions",
    "Custom Solutions",
    "Industry Trends",
    "Best Practices",
    "Case Studies",
    "Innovation",
    "Manufacturing"
  ];

  // Initialize the form with existing blog data or defaults
  const form = useForm<BlogFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: blog?.title || "",
      slug: blog?.slug || "",
      content: blog?.content || "",
      excerpt: blog?.excerpt || "",
      author: blog?.author || "Admin",
      status: blog?.status || "draft",
      publishDate: blog?.publishDate 
        ? new Date(blog.publishDate).toISOString().slice(0, 10) 
        : new Date().toISOString().slice(0, 10),
      images: blog?.images || [],
      categories: blog?.categories || [],
      tags: blog?.tags ? blog.tags.join(", ") : "",
      metaTitle: blog?.metaTitle || "",
      metaDescription: blog?.metaDescription || ""
    },
  });

  // When title changes, generate a slug automatically (if not editing)
  const watchTitle = form.watch("title");
  useEffect(() => {
    if (!isEditing && watchTitle && !form.getValues("slug")) {
      form.setValue("slug", slugify(watchTitle));
    }
  }, [watchTitle, form, isEditing]);

  // Mutations for creating or updating a blog post
  const createMutation = useMutation({
    mutationFn: async (data: BlogFormData) => {
      const response = await apiRequest("POST", "/api/blogs", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blogs'] });
      toast({
        title: "Success!",
        description: "Blog post created successfully.",
      });
      navigate("/admin/blogs");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create blog post: ${error}`,
        variant: "destructive",
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (data: BlogFormData) => {
      const formattedData = {
        ...data,
        publishDate: data.publishDate ? new Date(data.publishDate).toISOString() : new Date().toISOString()
      };
      const response = await apiRequest("PUT", `/api/blogs/${blog?.id}`, formattedData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blogs'] });
      toast({
        title: "Success!",
        description: "Blog post updated successfully.",
      });
      navigate("/admin/blogs");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update blog post: ${error}`,
        variant: "destructive",
      });
    }
  });

  // Handle form submission
  const onSubmit = (data: BlogFormData) => {
    // Before submitting form, ensure content field is updated with the latest HTML content
    form.setValue("content", content);

    // Process the tags from comma-separated to array
    const processedData = { 
      ...data,
      content,  // This includes the HTML content with inline images
      images: uploadedImages,
      categories: selectedCategories,
      tags: data.tags ? data.tags.split(",").map(tag => tag.trim()) : []
    };

    if (isEditing && blog) {
      updateMutation.mutate(processedData);
    } else {
      createMutation.mutate(processedData);
    }
  };

  // Handle image upload completion
  const handleImagesUploaded = (urls: string[]) => {
    setUploadedImages(prev => [...prev, ...urls]);
    form.setValue("images", [...uploadedImages, ...urls]);
  };

  // Handle inline image insertion
  const insertImageInContent = (imageUrl: string) => {
    // Get current cursor position
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const cursorPosition = textarea.selectionStart;
    const textBefore = content.substring(0, cursorPosition);
    const textAfter = content.substring(cursorPosition);

    // Insert image HTML tag at cursor position
    const imageTag = `<img src="${imageUrl}" alt="Blog image" class="max-w-full h-auto my-4 rounded-md" />`;
    const newContent = textBefore + imageTag + textAfter;

    setContent(newContent);
  };

  // Handle image removal
  const handleRemoveImage = (indexToRemove: number) => {
    const updatedImages = uploadedImages.filter((_, index) => index !== indexToRemove);
    setUploadedImages(updatedImages);
    form.setValue("images", updatedImages);
  };

  // Handle category selection
  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Title Field */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="title">
              Post Title
            </label>
            <input 
              {...form.register("title")}
              id="title"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f47920]" 
              placeholder="Enter post title"
            />
            {form.formState.errors.title && (
              <p className="text-red-500 text-sm mt-1">{form.formState.errors.title.message}</p>
            )}
          </div>

          {/* Slug Field */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="slug">
              Slug
            </label>
            <div className="flex items-center">
              <span className="text-gray-500 text-sm">/blog/</span>
              <input 
                {...form.register("slug")}
                id="slug"
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f47920]" 
                placeholder="post-slug"
              />
            </div>
            {form.formState.errors.slug && (
              <p className="text-red-500 text-sm mt-1">{form.formState.errors.slug.message}</p>
            )}
          </div>

          {/* Rich Text Editor */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Content
            </label>

            {/* Instructions for using the text-image pattern */}
            <div className="bg-blue-50 p-3 mb-3 rounded-md border border-blue-200 text-sm">
              <h4 className="font-bold text-blue-700 mb-1">How to create text-image-text pattern:</h4>
              <ol className="list-decimal pl-5 text-blue-700">
                <li>Write your first paragraph of text</li>
                <li>Position your cursor where you want the image to appear</li>
                <li>Click the <strong>"Insert Image"</strong> button and select an image</li>
                <li>Continue writing text after the image</li>
                <li>Repeat for multiple images</li>
              </ol>
              <p className="mt-2 text-blue-600 italic">You can also insert images directly from the gallery below</p>
            </div>

            <div className="border border-gray-300 rounded-md overflow-hidden">
              <div className="bg-gray-100 border-b border-gray-300 px-3 py-2 flex flex-wrap gap-2">
                <button type="button" className="p-1 hover:bg-gray-200 rounded" title="Bold">
                  <i className="fas fa-bold"></i>
                </button>
                <button type="button" className="p-1 hover:bg-gray-200 rounded" title="Italic">
                  <i className="fas fa-italic"></i>
                </button>
                <button type="button" className="p-1 hover:bg-gray-200 rounded" title="Underline">
                  <i className="fas fa-underline"></i>
                </button>
                <button type="button" className="p-1 hover:bg-gray-200 rounded" title="Link">
                  <i className="fas fa-link"></i>
                </button>
                <button type="button" className="p-1 hover:bg-gray-200 rounded" title="Bullet List">
                  <i className="fas fa-list-ul"></i>
                </button>
                <button type="button" className="p-1 hover:bg-gray-200 rounded" title="Numbered List">
                  <i className="fas fa-list-ol"></i>
                </button>
                <button type="button" className="p-1 hover:bg-gray-200 rounded" title="Quote">
                  <i className="fas fa-quote-right"></i>
                </button>
                <button type="button" className="p-1 hover:bg-gray-200 rounded" title="Insert Code">
                  <i className="fas fa-code"></i>
                </button>
                <div className="h-5 border-r border-gray-300 mx-1"></div>

                {/* Image Insertion Button - Always Visible */}
                <MediaSelector 
                  onImageSelect={insertImageInContent} 
                  triggerButton={
                    <button 
                      type="button" 
                      className="p-1 bg-blue-100 hover:bg-blue-200 rounded text-blue-700 font-medium" 
                      title="Insert Image from Media Library"
                    >
                      <i className="fas fa-image mr-1"></i> Insert Image
                    </button>
                  }
                />
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="p-3 min-h-[300px] w-full bg-white focus:outline-none"
                placeholder="Enter blog content here..."
              />
            </div>
            {form.formState.errors.content && (
              <p className="text-red-500 text-sm mt-1">{form.formState.errors.content.message}</p>
            )}
          </div>

          {/* Excerpt Field */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="excerpt">
              Excerpt (optional)
            </label>
            <textarea 
              {...form.register("excerpt")}
              id="excerpt"
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f47920]" 
              placeholder="Brief summary of the post"
            />
            {form.formState.errors.excerpt && (
              <p className="text-red-500 text-sm mt-1">{form.formState.errors.excerpt.message}</p>
            )}
          </div>

          {/* Image Upload */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Images
            </label>
            <ImageUpload onUploadComplete={handleImagesUploaded} />

            {/* Uploaded Images Preview */}
            {uploadedImages.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-4">
                {uploadedImages.map((imageUrl, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={imageUrl} 
                      alt={`Blog image ${index + 1}`} 
                      className="w-full h-24 object-cover rounded"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                      <button 
                        type="button"
                        onClick={() => insertImageInContent(imageUrl)}
                        className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs"
                        title="Insert into content"
                      >
                        <i className="fas fa-plus"></i>
                      </button>
                      <button 
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs"
                        title="Remove image"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="lg:col-span-1">
          {/* Publishing Options */}
          <div className="bg-gray-50 rounded-md p-4 mb-4">
            <h4 className="font-bold text-gray-700 mb-3">Publishing Options</h4>

            <div className="mb-3">
              <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="status">
                Status
              </label>
              <select 
                {...form.register("status")}
                id="status"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f47920]"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="publishDate">
                Publish Date
              </label>
              <input 
                {...form.register("publishDate")}
                type="date"
                id="publishDate"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f47920]"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="author">
                Author
              </label>
              <input 
                {...form.register("author")}
                id="author"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f47920]"
              />
            </div>
          </div>

          {/* Categories & Tags */}
          <div className="bg-gray-50 rounded-md p-4 mb-4">
            <h4 className="font-bold text-gray-700 mb-3">Categories & Tags</h4>

            <div className="mb-3">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Categories
              </label>
              <div className="space-y-1">
                {availableCategories.map((category, index) => (
                  <div key={index} className="flex items-center">
                    <input 
                      type="checkbox" 
                      id={`cat-${index}`} 
                      className="mr-2"
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryToggle(category)}
                    />
                    <label htmlFor={`cat-${index}`} className="text-sm">{category}</label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="tags">
                Tags
              </label>
              <input 
                {...form.register("tags")}
                id="tags"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f47920]" 
                placeholder="tag1, tag2, tag3"
              />
              <div className="text-xs text-gray-500 mt-1">Separate tags with commas</div>
            </div>
          </div>

          {/* SEO Settings */}
          <SeoSettings 
            metaTitle={form.watch("metaTitle")}
            metaDescription={form.watch("metaDescription")}
            onMetaTitleChange={(value) => form.setValue("metaTitle", value)}
            onMetaDescriptionChange={(value) => form.setValue("metaDescription", value)}
          />
        </div>
      </div>

      <div className="flex justify-between">
        <button 
          type="button" 
          onClick={() => navigate("/admin/blogs")}
          className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md"
        >
          Cancel
        </button>

        <div>
          <button 
            type="button" 
            onClick={() => {
              form.setValue("status", "draft");
              form.handleSubmit(onSubmit)();
            }}
            className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md mr-2"
          >
            Save Draft
          </button>
          <button 
            type="submit" 
            className="bg-[#f47920] text-white py-2 px-4 rounded-md"
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {(createMutation.isPending || updateMutation.isPending) ? (
              <span>Saving...</span>
            ) : isEditing ? (
              <span>Update</span>
            ) : (
              <span>Publish</span>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}