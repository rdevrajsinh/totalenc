import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { getAuthToken, removeAuthToken } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const [activeMenuItem, setActiveMenuItem] = useState("dashboard");
  
  // Check authentication on mount
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      navigate("/admin/login");
      toast({
        title: "Authentication Required",
        description: "Please log in to access the admin area.",
        variant: "destructive",
      });
    }
    
    // Set active menu item based on current path
    const path = location.split("/")[2] || "dashboard";
    setActiveMenuItem(path);
  }, [location, navigate, toast]);
  
  const handleLogout = () => {
    removeAuthToken();
    navigate("/admin/login");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="bg-[#002357] text-white p-4">
        <h3 className="font-bold text-xl">Total Enclosures Admin Dashboard</h3>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5">
        {/* Sidebar Navigation */}
        <div className="bg-gray-800 text-white lg:min-h-screen p-0 lg:col-span-1">
          <nav>
            <ul>
              <li className={`border-b border-gray-700 ${activeMenuItem === "dashboard" ? "bg-gray-700" : ""}`}>
                <Link href="/admin" className="block py-3 px-4 hover:bg-gray-700">
                  <i className="fas fa-tachometer-alt mr-2"></i> Dashboard
                </Link>
              </li>
              <li className={`border-b border-gray-700 ${activeMenuItem === "blogs" ? "bg-gray-700" : ""}`}>
                <Link href="/admin/blogs" className="block py-3 px-4 hover:bg-gray-700">
                  <i className="fas fa-newspaper mr-2"></i> Blog Posts
                </Link>
              </li>
              <li className={`border-b border-gray-700 ${activeMenuItem === "categories" ? "bg-gray-700" : ""}`}>
                <Link href="/admin/categories" className="block py-3 px-4 hover:bg-gray-700">
                  <i className="fas fa-folder mr-2"></i> Categories
                </Link>
              </li>
              <li className={`border-b border-gray-700 ${activeMenuItem === "media" ? "bg-gray-700" : ""}`}>
                <Link href="/admin/media" className="block py-3 px-4 hover:bg-gray-700">
                  <i className="fas fa-image mr-2"></i> Media Library
                </Link>
              </li>
              <li className={`border-b border-gray-700 ${activeMenuItem === "comments" ? "bg-gray-700" : ""}`}>
                <Link href="/admin/comments" className="block py-3 px-4 hover:bg-gray-700">
                  <i className="fas fa-comments mr-2"></i> Comments
                </Link>
              </li>
              <li className={`border-b border-gray-700 ${activeMenuItem === "users" ? "bg-gray-700" : ""}`}>
                <Link href="/admin/users" className="block py-3 px-4 hover:bg-gray-700">
                  <i className="fas fa-users mr-2"></i> Users
                </Link>
              </li>
              <li className={`border-b border-gray-700 ${activeMenuItem === "settings" ? "bg-gray-700" : ""}`}>
                <Link href="/admin/settings" className="block py-3 px-4 hover:bg-gray-700">
                  <i className="fas fa-cog mr-2"></i> Settings
                </Link>
              </li>
              <li className="border-b border-gray-700">
                <button 
                  onClick={handleLogout}
                  className="w-full text-left block py-3 px-4 hover:bg-gray-700"
                >
                  <i className="fas fa-sign-out-alt mr-2"></i> Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>
        
        {/* Content Area */}
        <div className="p-6 lg:col-span-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
            <div className="flex items-center space-x-2">
              <Link href="/" className="text-sm text-blue-600 hover:text-blue-800">
                <i className="fas fa-external-link-alt mr-1"></i> View Site
              </Link>
            </div>
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
}
