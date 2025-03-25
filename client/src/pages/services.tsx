import { useQuery } from "@tanstack/react-query";
import { Helmet } from 'react-helmet';
import { Service } from "@/lib/types";
import { getImagePlaceholder } from "@/lib/utils";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ContactCTA from "@/components/home/contact-cta";
import { useState } from "react";
import { Link } from "wouter";

export default function ServicesPage() {
  // Get service hierarchy instead of flat list
  const { data: serviceHierarchy, isLoading } = useQuery<Service[]>({
    queryKey: ['/api/services/hierarchy'],
  });

  return (
    <>
      <Helmet>
        <title>Services | Total Enclosures</title>
        <meta name="description" content="Explore our comprehensive range of services including standard enclosures, custom solutions, and modification services for industrial applications." />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Open+Sans:wght@400;600&display=swap" rel="stylesheet" />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow pt-32">
          {/* Page Header */}
          <section className="bg-[#002357] py-16 text-white">
            <div className="container mx-auto px-4">
              <h1 className="text-4xl font-bold mb-4 font-poppins">Our Services</h1>
              <p className="text-xl max-w-3xl">
                We offer a comprehensive range of services to meet all your enclosure needs, from standard products to fully customized solutions.
              </p>
            </div>
          </section>
          
          {/* Services Listing */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                      <div className="h-64 bg-gray-300"></div>
                      <div className="p-6">
                        <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
                        <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : serviceHierarchy && serviceHierarchy.length > 0 ? (
                <div>
                  {/* Main services */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {serviceHierarchy.map(service => (
                      <div key={service.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <div 
                          className="h-64 bg-cover bg-center" 
                          style={{ backgroundImage: `url('${service.image || getImagePlaceholder('service')}')` }}
                        ></div>
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-[#002357] mb-3 font-poppins">{service.name}</h3>
                          <p className="text-gray-600 mb-4">{service.description}</p>
                          <Link href={`/services/${service.slug}`} className="text-[#f47920] hover:text-[#ff8f3e] font-semibold flex items-center">
                            Learn More <i className="fas fa-arrow-right ml-2"></i>
                          </Link>
                        </div>

                        {/* If this service has children, show a preview */}
                        {service.children && service.children.length > 0 && (
                          <div className="px-6 pb-6">
                            <div className="mt-2 border-t pt-4">
                              <p className="font-medium text-sm text-gray-700 mb-2">Related Services:</p>
                              <div className="flex flex-wrap gap-2">
                                {(service.children as Service[]).map(child => (
                                  <Link 
                                    key={child.id}
                                    href={`/services/${child.slug}`} 
                                    className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
                                  >
                                    {child.name}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-2xl font-bold text-gray-700 mb-2">No Services Found</h3>
                  <p className="text-gray-600">
                    Services information will be available soon.
                  </p>
                </div>
              )}
            </div>
          </section>
          
          {/* Process */}
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-[#002357] mb-4 font-poppins">Our Service Process</h2>
                <p className="max-w-3xl mx-auto text-gray-600">
                  We follow a systematic approach to ensure that we deliver high-quality solutions that meet your specific requirements.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md text-center relative">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#f47920] text-white text-2xl font-bold mb-4">
                    1
                  </div>
                  <h3 className="text-xl font-bold text-[#002357] mb-3 font-poppins">Consultation</h3>
                  <p className="text-gray-600">
                    We begin by understanding your specific requirements and challenges to determine the best solution.
                  </p>
                  
                  {/* Arrow - visible only on larger screens */}
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-[#f47920] text-2xl">
                    <i className="fas fa-chevron-right"></i>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md text-center relative">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#f47920] text-white text-2xl font-bold mb-4">
                    2
                  </div>
                  <h3 className="text-xl font-bold text-[#002357] mb-3 font-poppins">Design</h3>
                  <p className="text-gray-600">
                    Our engineers design a solution that addresses your needs, with detailed specifications and plans.
                  </p>
                  
                  {/* Arrow - visible only on larger screens */}
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-[#f47920] text-2xl">
                    <i className="fas fa-chevron-right"></i>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md text-center relative">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#f47920] text-white text-2xl font-bold mb-4">
                    3
                  </div>
                  <h3 className="text-xl font-bold text-[#002357] mb-3 font-poppins">Manufacturing</h3>
                  <p className="text-gray-600">
                    We manufacture your enclosure with precision, using high-quality materials and rigorous quality control.
                  </p>
                  
                  {/* Arrow - visible only on larger screens */}
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-[#f47920] text-2xl">
                    <i className="fas fa-chevron-right"></i>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#f47920] text-white text-2xl font-bold mb-4">
                    4
                  </div>
                  <h3 className="text-xl font-bold text-[#002357] mb-3 font-poppins">Delivery</h3>
                  <p className="text-gray-600">
                    We deliver your solution on schedule, with installation support and after-sales service as needed.
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          {/* Testimonials */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-[#002357] mb-4 font-poppins">What Our Clients Say</h2>
                <p className="max-w-3xl mx-auto text-gray-600">
                  Don't just take our word for it. Here's what our clients have to say about our services.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center mb-4">
                    <div className="text-yellow-400 flex">
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">
                    "Total Enclosures provided us with custom solutions that perfectly met our needs. Their attention to detail and quality of work exceeded our expectations."
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gray-200 mr-3"></div>
                    <div>
                      <h4 className="font-bold text-[#002357]">John Smith</h4>
                      <p className="text-sm text-gray-500">Manufacturing Director, ABC Industries</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center mb-4">
                    <div className="text-yellow-400 flex">
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">
                    "We've been working with Total Enclosures for over 5 years, and they consistently deliver high-quality products on time and within budget. Highly recommended!"
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gray-200 mr-3"></div>
                    <div>
                      <h4 className="font-bold text-[#002357]">Sarah Johnson</h4>
                      <p className="text-sm text-gray-500">Project Manager, XYZ Solutions</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center mb-4">
                    <div className="text-yellow-400 flex">
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star-half-alt"></i>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">
                    "The modification services provided by Total Enclosures were exactly what we needed. Their team was professional, efficient, and delivered outstanding results."
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gray-200 mr-3"></div>
                    <div>
                      <h4 className="font-bold text-[#002357]">Michael Brown</h4>
                      <p className="text-sm text-gray-500">Technical Lead, DEF Corporation</p>
                    </div>
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
