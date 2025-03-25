import { Link } from "wouter";
import { Blog } from "@/lib/types";
import { formatDate, getImagePlaceholder, truncateText } from "@/lib/utils";

interface BlogCardProps {
  blog: Blog;
}

export default function BlogCard({ blog }: BlogCardProps) {
  const featuredImage = blog.images && blog.images.length > 0 
    ? blog.images[0] 
    : getImagePlaceholder('blog');
  
  // Use excerpt if available, otherwise generate from content
  const displayExcerpt = blog.excerpt || truncateText(
    blog.content.replace(/<[^>]*>/g, ''), // Strip HTML tags
    150
  );

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div 
        className="h-52 bg-cover bg-center" 
        style={{ backgroundImage: `url('${featuredImage}')` }}
      ></div>
      <div className="p-6">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <span className="mr-3">
            <i className="far fa-calendar mr-1"></i> {formatDate(blog.publishDate)}
          </span>
          <span>
            <i className="far fa-user mr-1"></i> {blog.author}
          </span>
        </div>
        <h3 className="text-xl font-bold text-[#002357] mb-2 font-poppins">{blog.title}</h3>
        <p className="text-gray-600 mb-4">{displayExcerpt}</p>
        <Link 
          href={`/blog/${blog.slug}`} 
          className="text-[#f47920] hover:text-[#ff8f3e] font-semibold flex items-center"
        >
          Read More <i className="fas fa-arrow-right ml-2"></i>
        </Link>
      </div>
    </div>
  );
}
