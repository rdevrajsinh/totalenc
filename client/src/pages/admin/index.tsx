import { useQuery } from "@tanstack/react-query";
import { Helmet } from 'react-helmet';
import { Blog, Product, Service, ContactMessage } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import AdminLayout from "@/components/admin/admin-layout";
import { Link } from "wouter";

export default function AdminDashboard() {
  const { data: blogs } = useQuery<Blog[]>({
    queryKey: ['/api/blogs'],
  });
  
  const { data: products } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });
  
  const { data: services } = useQuery<Service[]>({
    queryKey: ['/api/services'],
  });
  
  // For a real app, you'd have an API for this
  const recentMessages: ContactMessage[] = [];

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Total Enclosures</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Open+Sans:wght@400;600&display=swap" rel="stylesheet" />
      </Helmet>
      
      <AdminLayout title="Dashboard">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <i className="fas fa-newspaper text-xl"></i>
              </div>
              <div>
                <p className="text-sm text-gray-500">Blog Posts</p>
                <h3 className="text-2xl font-bold">{blogs?.length || 0}</h3>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <i className="fas fa-box text-xl"></i>
              </div>
              <div>
                <p className="text-sm text-gray-500">Products</p>
                <h3 className="text-2xl font-bold">{products?.length || 0}</h3>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                <i className="fas fa-wrench text-xl"></i>
              </div>
              <div>
                <p className="text-sm text-gray-500">Services</p>
                <h3 className="text-2xl font-bold">{services?.length || 0}</h3>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100 text-orange-600 mr-4">
                <i className="fas fa-envelope text-xl"></i>
              </div>
              <div>
                <p className="text-sm text-gray-500">Messages</p>
                <h3 className="text-2xl font-bold">{recentMessages?.length || 0}</h3>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Blog Posts */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-800">Recent Blog Posts</h3>
                <Link 
                  href="/admin/blogs" 
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  View All
                </Link>
              </div>
              
              <div className="p-4">
                {blogs?.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No blog posts found.</p>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {blogs?.slice(0, 5).map(blog => (
                      <div key={blog.id} className="py-3 flex justify-between items-center">
                        <div>
                          <Link 
                            href={`/admin/blogs/${blog.id}`}
                            className="font-medium text-gray-800 hover:text-[#002357]"
                          >
                            {blog.title}
                          </Link>
                          <p className="text-sm text-gray-500">
                            {formatDate(blog.publishDate)} • {blog.status}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Link 
                            href={`/admin/blogs/${blog.id}`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <i className="fas fa-edit"></i>
                          </Link>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="bg-gray-50 p-4 border-t border-gray-100">
                <Link 
                  href="/admin/blogs/new" 
                  className="text-[#f47920] hover:text-[#ff8f3e] font-medium"
                >
                  <i className="fas fa-plus mr-2"></i> Create New Blog Post
                </Link>
              </div>
            </div>
          </div>
          
          {/* Quick Links & Activity */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mb-6">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-800">Quick Links</h3>
              </div>
              
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <Link 
                    href="/admin/blogs/new" 
                    className="flex flex-col items-center justify-center bg-gray-50 p-4 rounded-lg hover:bg-gray-100"
                  >
                    <i className="fas fa-plus-circle text-[#f47920] text-2xl mb-2"></i>
                    <span className="text-sm text-gray-700">New Blog</span>
                  </Link>
                  
                  <Link 
                    href="#" 
                    className="flex flex-col items-center justify-center bg-gray-50 p-4 rounded-lg hover:bg-gray-100"
                  >
                    <i className="fas fa-box text-[#002357] text-2xl mb-2"></i>
                    <span className="text-sm text-gray-700">Products</span>
                  </Link>
                  
                  <Link 
                    href="#" 
                    className="flex flex-col items-center justify-center bg-gray-50 p-4 rounded-lg hover:bg-gray-100"
                  >
                    <i className="fas fa-wrench text-[#002357] text-2xl mb-2"></i>
                    <span className="text-sm text-gray-700">Services</span>
                  </Link>
                  
                  <Link 
                    href="#" 
                    className="flex flex-col items-center justify-center bg-gray-50 p-4 rounded-lg hover:bg-gray-100"
                  >
                    <i className="fas fa-cog text-[#002357] text-2xl mb-2"></i>
                    <span className="text-sm text-gray-700">Settings</span>
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-800">Recent Activity</h3>
              </div>
              
              <div className="p-4">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
                      <i className="fas fa-edit"></i>
                    </div>
                    <div>
                      <p className="text-sm text-gray-800">Blog post updated</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="p-2 rounded-full bg-green-100 text-green-600 mr-3">
                      <i className="fas fa-plus"></i>
                    </div>
                    <div>
                      <p className="text-sm text-gray-800">New product added</p>
                      <p className="text-xs text-gray-500">Yesterday</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="p-2 rounded-full bg-yellow-100 text-yellow-600 mr-3">
                      <i className="fas fa-user"></i>
                    </div>
                    <div>
                      <p className="text-sm text-gray-800">User login</p>
                      <p className="text-xs text-gray-500">2 days ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
}
