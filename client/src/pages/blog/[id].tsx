import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Helmet } from 'react-helmet';
import { Blog } from "@/lib/types";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import BlogDetail from "@/components/blog/blog-detail";
import ContactCTA from "@/components/home/contact-cta";
import NotFound from "@/pages/not-found";

export default function BlogDetailPage() {
  const [, params] = useRoute("/blog/:id");
  const blogSlug = params?.id;
  
  const { data: blog, isLoading, error } = useQuery<Blog>({
    queryKey: [`/api/blogs/${blogSlug}`],
    enabled: !!blogSlug,
  });
  
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-32">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto">
              <div className="animate-pulse">
                <div className="h-80 bg-gray-300 rounded-lg mb-8"></div>
                <div className="h-10 bg-gray-300 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/4 mb-8"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (error || !blog) {
    return <NotFound />;
  }

  return (
    <>
      <Helmet>
        <title>{blog.metaTitle || blog.title} | Total Enclosures</title>
        <meta name="description" content={blog.metaDescription || blog.excerpt || blog.title} />
        {blog.images && blog.images.length > 0 && (
          <meta property="og:image" content={blog.images[0]} />
        )}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Open+Sans:wght@400;600&display=swap" rel="stylesheet" />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow pt-32">
          <section className="py-16">
            <div className="container mx-auto px-4">
              <BlogDetail blog={blog} />
              
              {/* Share & Related Posts */}
              <div className="max-w-4xl mx-auto mt-12">
                {/* Social Share */}
                <div className="bg-gray-50 p-6 rounded-lg mb-12">
                  <h3 className="text-xl font-bold text-[#002357] mb-4 font-poppins">Share This Post</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="bg-[#3b5998] text-white p-3 rounded-md hover:opacity-90 transition-opacity">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                    <a href="#" className="bg-[#1da1f2] text-white p-3 rounded-md hover:opacity-90 transition-opacity">
                      <i className="fab fa-twitter"></i>
                    </a>
                    <a href="#" className="bg-[#0077b5] text-white p-3 rounded-md hover:opacity-90 transition-opacity">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                    <a href="#" className="bg-[#25D366] text-white p-3 rounded-md hover:opacity-90 transition-opacity">
                      <i className="fab fa-whatsapp"></i>
                    </a>
                    <a href="#" className="bg-[#bd081c] text-white p-3 rounded-md hover:opacity-90 transition-opacity">
                      <i className="fab fa-pinterest-p"></i>
                    </a>
                  </div>
                </div>
                
                {/* Related Posts - would be dynamically generated in a real app */}
                <div>
                  <h3 className="text-2xl font-bold text-[#002357] mb-6 font-poppins">Related Posts</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((_, index) => (
                      <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="h-40 bg-gray-200 bg-cover bg-center"></div>
                        <div className="p-4">
                          <h4 className="font-bold text-[#002357] mb-2 font-poppins">Related Post Title</h4>
                          <p className="text-sm text-gray-600 mb-3">
                            This is where a related post excerpt would appear.
                          </p>
                          <a href="#" className="text-[#f47920] hover:text-[#ff8f3e] text-sm font-semibold">
                            Read More
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
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
