import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Helmet } from 'react-helmet';
import { Blog } from "@/lib/types";
import AdminLayout from "@/components/admin/admin-layout";
import BlogForm from "@/components/admin/blog-form";
import { useToast } from "@/hooks/use-toast";

export default function AdminEditBlog() {
  const [, params] = useRoute("/admin/blogs/:id");
  const blogId = params?.id ? parseInt(params.id) : undefined;
  const { toast } = useToast();
  
  const { data: blog, isLoading, error } = useQuery<Blog>({
    queryKey: [`/api/blogs/${blogId}`],
    enabled: !!blogId,
  });
  
  if (error) {
    toast({
      title: "Error",
      description: "Failed to load blog post. Please try again.",
      variant: "destructive",
    });
  }

  return (
    <>
      <Helmet>
        <title>Edit Blog | Admin | Total Enclosures</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Open+Sans:wght@400;600&display=swap" rel="stylesheet" />
      </Helmet>
      
      <AdminLayout title="Edit Blog Post">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-12 bg-gray-200 rounded w-3/4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            </div>
          ) : blog ? (
            <BlogForm blog={blog} isEditing={true} />
          ) : (
            <div className="text-center py-8">
              <div className="text-red-500 mb-4">
                <i className="fas fa-exclamation-circle text-5xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Blog Post Not Found</h2>
              <p className="text-gray-600 mb-6">
                The blog post you are trying to edit could not be found.
              </p>
            </div>
          )}
        </div>
      </AdminLayout>
    </>
  );
}
