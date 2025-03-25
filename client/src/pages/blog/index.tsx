import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from 'react-helmet';
import { Blog } from "@/lib/types";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import BlogCard from "@/components/blog/blog-card";
import ContactCTA from "@/components/home/contact-cta";

export default function BlogIndex() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const { data: blogs, isLoading, error } = useQuery<Blog[]>({
    queryKey: ['/api/blogs'],
  });
  
  // Filter blogs based on search and category
  const filteredBlogs = blogs?.filter(blog => {
    const matchesSearch = searchQuery === "" || 
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === null || 
      blog.categories.includes(selectedCategory);
    
    return matchesSearch && matchesCategory;
  });
  
  // Extract all unique categories from blogs
  const allCategories = blogs?.reduce<string[]>((acc, blog) => {
    blog.categories.forEach(category => {
      if (!acc.includes(category)) {
        acc.push(category);
      }
    });
    return acc;
  }, []) || [];

  return (
    <>
      <Helmet>
        <title>Blog | Total Enclosures</title>
        <meta name="description" content="Read our latest news, insights, and industry trends in the world of industrial enclosures." />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Open+Sans:wght@400;600&display=swap" rel="stylesheet" />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow pt-32">
          {/* Page Header */}
          <section className="bg-[#002357] py-16 text-white">
            <div className="container mx-auto px-4">
              <h1 className="text-4xl font-bold mb-4 font-poppins">Blog</h1>
              <p className="text-xl max-w-3xl">
                Stay updated with the latest news, insights, and industry trends in the world of industrial enclosures.
              </p>
            </div>
          </section>
          
          {/* Blog Listing */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                  {/* Search */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-[#002357] mb-4 font-poppins">Search</h3>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search articles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f47920]"
                      />
                      <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                    </div>
                  </div>
                  
                  {/* Categories */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-[#002357] mb-4 font-poppins">Categories</h3>
                    <ul className="space-y-2">
                      <li>
                        <button
                          onClick={() => setSelectedCategory(null)}
                          className={`w-full text-left px-2 py-1 rounded hover:bg-gray-100 ${
                            selectedCategory === null ? 'font-bold text-[#f47920]' : 'text-gray-700'
                          }`}
                        >
                          All Categories
                        </button>
                      </li>
                      {allCategories.map((category, index) => (
                        <li key={index}>
                          <button
                            onClick={() => setSelectedCategory(category)}
                            className={`w-full text-left px-2 py-1 rounded hover:bg-gray-100 ${
                              selectedCategory === category ? 'font-bold text-[#f47920]' : 'text-gray-700'
                            }`}
                          >
                            {category}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Recent Posts */}
                  <div>
                    <h3 className="text-xl font-bold text-[#002357] mb-4 font-poppins">Recent Posts</h3>
                    <div className="space-y-4">
                      {isLoading ? (
                        Array(3).fill(0).map((_, i) => (
                          <div key={i} className="flex items-center animate-pulse">
                            <div className="w-16 h-16 bg-gray-300 rounded mr-3"></div>
                            <div className="flex-grow">
                              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                              <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                            </div>
                          </div>
                        ))
                      ) : blogs && blogs.slice(0, 3).map(blog => (
                        <div key={blog.id} className="flex items-center">
                          <div className="w-16 h-16 bg-cover bg-center rounded mr-3" 
                               style={{ backgroundImage: `url('${blog.images[0] || "https://placehold.co/600x400/002357/FFF?text=Blog"}')` }}>
                          </div>
                          <div>
                            <a href={`/blog/${blog.slug}`} className="text-[#002357] hover:text-[#f47920] font-medium">
                              {blog.title}
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Blog Grid */}
                <div className="lg:col-span-3">
                  {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {Array(4).fill(0).map((_, i) => (
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
                      ))}
                    </div>
                  ) : error ? (
                    <div className="bg-red-100 text-red-700 p-4 rounded">
                      <p>Error loading blog posts. Please try again later.</p>
                    </div>
                  ) : filteredBlogs && filteredBlogs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {filteredBlogs.map(blog => (
                        <BlogCard key={blog.id} blog={blog} />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-100 p-8 rounded-lg text-center">
                      <h3 className="text-xl font-bold text-gray-700 mb-2">No Blog Posts Found</h3>
                      <p className="text-gray-600">
                        {searchQuery || selectedCategory
                          ? "Try adjusting your search criteria or category selection."
                          : "Check back soon for new content."}
                      </p>
                    </div>
                  )}
                  
                  {/* Pagination (static for now) */}
                  {filteredBlogs && filteredBlogs.length > 0 && (
                    <div className="mt-12 flex justify-center">
                      <nav className="inline-flex rounded-md shadow-sm">
                        <a href="#" className="py-2 px-4 border border-gray-300 bg-white text-gray-700 rounded-l-md hover:bg-gray-50">
                          Previous
                        </a>
                        <a href="#" className="py-2 px-4 border-t border-b border-gray-300 bg-[#002357] text-white">
                          1
                        </a>
                        <a href="#" className="py-2 px-4 border-t border-b border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
                          2
                        </a>
                        <a href="#" className="py-2 px-4 border-t border-b border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
                          3
                        </a>
                        <a href="#" className="py-2 px-4 border border-gray-300 bg-white text-gray-700 rounded-r-md hover:bg-gray-50">
                          Next
                        </a>
                      </nav>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
          
          <ContactCTA />
        </main>
        
        <Footer />
      </div>
    </>
  );
}
