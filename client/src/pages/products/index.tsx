import { useQuery } from "@tanstack/react-query";
import { Helmet } from 'react-helmet';
import { Product } from "@/lib/types";
import { getImagePlaceholder } from "@/lib/utils";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ContactCTA from "@/components/home/contact-cta";
import { useState } from "react";

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });
  
  // Filter products by category
  const filteredProducts = selectedCategory 
    ? products?.filter(product => product.category === selectedCategory)
    : products;
  
  // Extract all unique categories
  const categories = [...new Set(products?.map(product => product.category).filter(Boolean))] as string[];

  return (
    <>
      <Helmet>
        <title>Products | Total Enclosures</title>
        <meta name="description" content="Discover our comprehensive range of high-quality enclosure solutions designed to meet the demands of various industrial applications." />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Open+Sans:wght@400;600&display=swap" rel="stylesheet" />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow pt-32">
          {/* Page Header */}
          <section className="bg-[#002357] py-16 text-white">
            <div className="container mx-auto px-4">
              <h1 className="text-4xl font-bold mb-4 font-poppins">Our Products</h1>
              <p className="text-xl max-w-3xl">
                Discover our comprehensive range of high-quality enclosure solutions designed to meet the demands of various industrial applications.
              </p>
            </div>
          </section>
          
          {/* Product Categories */}
          <section className="py-8 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-md ${
                    selectedCategory === null 
                      ? 'bg-[#002357] text-white' 
                      : 'bg-white text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  All Products
                </button>
                
                {categories.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-md ${
                      selectedCategory === category 
                        ? 'bg-[#002357] text-white' 
                        : 'bg-white text-gray-800 hover:bg-gray-100'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </section>
          
          {/* Products Listing */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {Array(6).fill(0).map((_, i) => (
                    <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                      <div className="h-64 bg-gray-300"></div>
                      <div className="p-6">
                        <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredProducts && filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProducts.map(product => (
                    <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div 
                        className="h-64 bg-cover bg-center" 
                        style={{ backgroundImage: `url('${product.image || getImagePlaceholder('product')}')` }}
                      ></div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-[#002357] mb-2 font-poppins">{product.name}</h3>
                        <p className="text-gray-600 mb-4">{product.description}</p>
                        <a href={`/products/${product.slug}`} className="inline-block bg-[#f47920] hover:bg-[#ff8f3e] text-white font-bold py-2 px-4 rounded-md transition-colors">
                          View Details
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-2xl font-bold text-gray-700 mb-2">No Products Found</h3>
                  <p className="text-gray-600">
                    {selectedCategory
                      ? `No products found in the "${selectedCategory}" category.`
                      : "No products available at the moment."}
                  </p>
                </div>
              )}
            </div>
          </section>
          
          {/* Product Information */}
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-[#002357] mb-4 font-poppins">Why Choose Our Products?</h2>
                <p className="max-w-3xl mx-auto text-gray-600">
                  Our products are designed and manufactured to the highest standards, providing reliable protection for your equipment.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="text-[#f47920] mb-4">
                    <i className="fas fa-medal text-4xl"></i>
                  </div>
                  <h3 className="text-xl font-bold text-[#002357] mb-3 font-poppins">Quality Materials</h3>
                  <p className="text-gray-600">
                    We use only the highest quality materials to ensure durability and longevity of our enclosures, even in the harshest environments.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="text-[#f47920] mb-4">
                    <i className="fas fa-tools text-4xl"></i>
                  </div>
                  <h3 className="text-xl font-bold text-[#002357] mb-3 font-poppins">Precision Engineering</h3>
                  <p className="text-gray-600">
                    Our products are engineered with precision to ensure perfect fit, functionality, and ease of installation for your specific applications.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="text-[#f47920] mb-4">
                    <i className="fas fa-cogs text-4xl"></i>
                  </div>
                  <h3 className="text-xl font-bold text-[#002357] mb-3 font-poppins">Customization Options</h3>
                  <p className="text-gray-600">
                    We offer extensive customization options to ensure that our enclosures meet your exact specifications and requirements.
                  </p>
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
