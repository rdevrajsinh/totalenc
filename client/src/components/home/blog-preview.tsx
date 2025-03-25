import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Blog } from "@/lib/types";
import { formatDate, getImagePlaceholder } from "@/lib/utils";
import BlogCard from "../blog/blog-card";

export default function BlogPreview() {
  const { data: blogs, isLoading } = useQuery<Blog[]>({
    queryKey: ['/api/blogs'],
  });

  // Only show the first 3 blogs
  const previewBlogs = blogs?.slice(0, 3);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#002357] mb-4 font-poppins">Latest Blog Posts</h2>
          <p className="max-w-3xl mx-auto text-gray-600">
            Stay updated with the latest news, insights, and industry trends in the world of industrial enclosures.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            // Show skeleton loaders while loading
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-52 bg-gray-300"></div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <div className="h-4 bg-gray-300 rounded w-24 mr-3"></div>
                    <div className="h-4 bg-gray-300 rounded w-16"></div>
                  </div>
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                </div>
              </div>
            ))
          ) : previewBlogs && previewBlogs.length > 0 ? (
            previewBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))
          ) : (
            <div className="col-span-3 text-center py-4">
              <p className="text-gray-500">No blog posts found.</p>
            </div>
          )}
        </div>
        
        <div className="text-center mt-12">
          <Link 
            href="/blog" 
            className="inline-block bg-[#002357] hover:bg-[#003a8c] text-white font-bold py-3 px-6 rounded-md transition-colors"
          >
            View All Blog Posts
          </Link>
        </div>
      </div>
    </section>
  );
}
