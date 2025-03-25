import { Blog } from "@/lib/types";
import { formatDate, getImagePlaceholder } from "@/lib/utils";
import { Link } from "wouter";

interface BlogDetailProps {
  blog: Blog;
}

export default function BlogDetail({ blog }: BlogDetailProps) {
  const featuredImage = blog.images && blog.images.length > 0 
    ? blog.images[0] 
    : getImagePlaceholder('blog');

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div 
        className="h-80 bg-cover bg-center" 
        style={{ backgroundImage: `url('${featuredImage}')` }}
      ></div>
      
      <div className="p-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {blog.categories.map((category, index) => (
            <span 
              key={index}
              className="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full"
            >
              {category}
            </span>
          ))}
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-[#002357] mb-3 font-poppins">{blog.title}</h1>
        
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <span className="mr-4">
            <i className="far fa-calendar mr-1"></i> {formatDate(blog.publishDate)}
          </span>
          <span>
            <i className="far fa-user mr-1"></i> {blog.author}
          </span>
        </div>
        
        <div 
          className="prose prose-lg max-w-none mb-8 blog-content"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
        
        {blog.tags && blog.tags.length > 0 && (
          <div className="border-t border-gray-200 pt-6 mt-8">
            <div className="flex flex-wrap items-center">
              <span className="text-gray-600 mr-2">Tags:</span>
              {blog.tags.map((tag, index) => (
                <Link 
                  key={index}
                  href={`/blog/tag/${tag}`}
                  className="text-[#0086cd] hover:text-[#1aa3e8] text-sm mr-2"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
