import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from 'react-helmet';
import { Link } from "wouter";
import { Blog } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/admin-layout";

export default function AdminBlogs() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
  const { data: blogs, isLoading } = useQuery<Blog[]>({
    queryKey: ['/api/blogs'],
  });
  
  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/blogs/${id}`, undefined);
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['/api/blogs'] });
      toast({
        title: "Blog Deleted",
        description: "The blog post has been successfully deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete blog post: ${error}`,
        variant: "destructive",
      });
    }
  });
  
  // Filter blogs based on search and status
  const filteredBlogs = blogs?.filter(blog => {
    const matchesSearch = searchQuery === "" || 
      blog.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === null || 
      blog.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Handle delete blog
  const handleDeleteBlog = (id: number) => {
    if (window.confirm("Are you sure you want to delete this blog post? This action cannot be undone.")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <>
      <Helmet>
        <title>Manage Blogs | Admin | Total Enclosures</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Open+Sans:wght@400;600&display=swap" rel="stylesheet" />
      </Helmet>
      
      <AdminLayout title="Blog Posts">
        {/* Actions Bar */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search blog posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f47920] w-full md:w-64"
              />
              <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            </div>
            
            {/* Status Filter */}
            <select
              value={statusFilter || ""}
              onChange={(e) => setStatusFilter(e.target.value === "" ? null : e.target.value)}
              className="py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f47920] w-full md:w-auto"
            >
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>
          
          <Link 
            href="/admin/blogs/new" 
            className="bg-[#f47920] text-white px-4 py-2 rounded-md hover:bg-[#ff8f3e] transition-colors flex items-center justify-center w-full md:w-auto"
          >
            <i className="fas fa-plus mr-2"></i> Add New Blog
          </Link>
        </div>
        
        {/* Blog List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categories</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  Array(5).fill(0).map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                      </td>
                    </tr>
                  ))
                ) : filteredBlogs && filteredBlogs.length > 0 ? (
                  filteredBlogs.map(blog => (
                    <tr key={blog.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {blog.images && blog.images[0] ? (
                            <div className="w-10 h-10 bg-cover bg-center rounded mr-3" 
                                 style={{ backgroundImage: `url('${blog.images[0]}')` }}>
                            </div>
                          ) : (
                            <div className="w-10 h-10 bg-gray-200 rounded mr-3 flex items-center justify-center text-gray-500">
                              <i className="fas fa-image"></i>
                            </div>
                          )}
                          <div>
                            <Link 
                              href={`/admin/blogs/${blog.id}`}
                              className="font-medium text-gray-800 hover:text-[#002357]"
                            >
                              {blog.title}
                            </Link>
                            <div className="text-xs text-gray-500">
                              <Link 
                                href={`/blog/${blog.slug}`}
                                className="hover:text-[#f47920]"
                                target="_blank"
                              >
                                View <i className="fas fa-external-link-alt ml-1"></i>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {blog.author}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {blog.categories.map((category, i) => (
                            <span 
                              key={i}
                              className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                            >
                              {category}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${blog.status === 'published' ? 'bg-green-100 text-green-800' : 
                            blog.status === 'draft' ? 'bg-gray-100 text-gray-800' : 
                            'bg-yellow-100 text-yellow-800'}`}
                        >
                          {blog.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(blog.publishDate)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <Link 
                            href={`/admin/blogs/${blog.id}`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <i className="fas fa-edit"></i>
                          </Link>
                          <button 
                            onClick={() => handleDeleteBlog(blog.id)}
                            className="text-red-600 hover:text-red-800"
                            disabled={deleteMutation.isPending}
                          >
                            {deleteMutation.isPending && deleteMutation.variables === blog.id ? (
                              <i className="fas fa-spinner fa-spin"></i>
                            ) : (
                              <i className="fas fa-trash-alt"></i>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      {searchQuery || statusFilter
                        ? "No blog posts match your search criteria."
                        : "No blog posts found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Pagination */}
        {filteredBlogs && filteredBlogs.length > 0 && (
          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">{filteredBlogs.length}</span> of{" "}
              <span className="font-medium">{blogs?.length}</span> blog posts
            </div>
            
            <nav className="inline-flex rounded-md shadow-sm">
              <a href="#" className="py-2 px-4 border border-gray-300 bg-white text-gray-700 rounded-l-md hover:bg-gray-50">
                Previous
              </a>
              <a href="#" className="py-2 px-4 border-t border-b border-gray-300 bg-[#002357] text-white">
                1
              </a>
              <a href="#" className="py-2 px-4 border border-gray-300 bg-white text-gray-700 rounded-r-md hover:bg-gray-50">
                Next
              </a>
            </nav>
          </div>
        )}
      </AdminLayout>
    </>
  );
}
