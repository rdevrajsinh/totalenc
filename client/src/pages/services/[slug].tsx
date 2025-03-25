import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Helmet } from 'react-helmet';
import { Service } from "@/lib/types";
import { getImagePlaceholder } from "@/lib/utils";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ContactCTA from "@/components/home/contact-cta";

interface ServiceWithSubs extends Service {
  subServices?: Service[];
}

export default function ServiceDetailPage() {
  const { slug } = useParams();
  
  const { data: service, isLoading, isError } = useQuery<ServiceWithSubs>({
    queryKey: ['/api/services', slug],
    queryFn: () => fetch(`/api/services/${slug}`).then(res => {
      if (!res.ok) {
        throw new Error('Service not found');
      }
      return res.json();
    }),
  });

  return (
    <>
      <Helmet>
        <title>{service?.metaTitle || service?.name || 'Service'} | Total Enclosures</title>
        <meta 
          name="description" 
          content={service?.metaDescription || service?.description || "Explore our comprehensive range of services for industrial enclosures."} 
        />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Open+Sans:wght@400;600&display=swap" rel="stylesheet" />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow pt-32">
          {isLoading ? (
            <div className="container mx-auto px-4 py-16">
              <div className="animate-pulse">
                <div className="h-10 bg-gray-300 rounded w-1/3 mb-8"></div>
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-12"></div>
                <div className="h-64 bg-gray-300 rounded mb-8"></div>
                <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-8"></div>
              </div>
            </div>
          ) : isError ? (
            <div className="container mx-auto px-4 py-16 text-center">
              <h1 className="text-3xl font-bold text-[#002357] mb-6">Service Not Found</h1>
              <p className="text-gray-600 mb-8">Sorry, the service you're looking for doesn't exist or has been moved.</p>
              <Link href="/services" className="bg-[#f47920] hover:bg-[#ff8f3e] text-white font-bold py-3 px-6 rounded-md transition-colors">
                View All Services
              </Link>
            </div>
          ) : service ? (
            <>
              {/* Service Header */}
              <section className="bg-[#002357] py-16 text-white">
                <div className="container mx-auto px-4">
                  <div className="flex flex-col md:flex-row items-start md:items-center">
                    <div className="flex-grow">
                      <div className="flex items-center text-sm mb-2">
                        <Link href="/services" className="text-gray-300 hover:text-white">Services</Link>
                        <i className="fas fa-chevron-right mx-2 text-xs text-gray-400"></i>
                        <span className="text-white">{service.name}</span>
                      </div>
                      <h1 className="text-4xl font-bold mb-4 font-poppins">{service.name}</h1>
                      <p className="text-xl max-w-3xl">
                        {service.description}
                      </p>
                    </div>
                    {service.image && (
                      <div className="mt-6 md:mt-0 md:ml-8">
                        <div className="w-32 h-32 bg-white rounded-full p-2 overflow-hidden">
                          <div 
                            className="w-full h-full rounded-full bg-cover bg-center" 
                            style={{ backgroundImage: `url('${service.image}')` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>
              
              {/* Service Content */}
              <section className="py-16">
                <div className="container mx-auto px-4">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main content */}
                    <div className="lg:col-span-2">
                      <div className="bg-white rounded-lg shadow-md p-8">
                        {service.image && (
                          <div 
                            className="h-96 bg-cover bg-center rounded-lg mb-8" 
                            style={{ backgroundImage: `url('${service.image}')` }}
                          ></div>
                        )}
                        
                        <div className="prose prose-lg max-w-none">
                          {service.fullDescription ? (
                            <div dangerouslySetInnerHTML={{ __html: service.fullDescription }} />
                          ) : (
                            <p className="text-gray-600">{service.description}</p>
                          )}
                        </div>
                        
                        {/* Features & Benefits */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                          {/* Features */}
                          {service.features && service.features.length > 0 && (
                            <div>
                              <h3 className="text-2xl font-bold text-[#002357] mb-4 font-poppins">Key Features</h3>
                              <ul className="space-y-2">
                                {service.features.map((feature, index) => (
                                  <li key={index} className="flex items-start">
                                    <i className="fas fa-check-circle text-[#f47920] mt-1 mr-2"></i>
                                    <span>{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {/* Benefits */}
                          {service.benefits && service.benefits.length > 0 && (
                            <div>
                              <h3 className="text-2xl font-bold text-[#002357] mb-4 font-poppins">Benefits</h3>
                              <ul className="space-y-2">
                                {service.benefits.map((benefit, index) => (
                                  <li key={index} className="flex items-start">
                                    <i className="fas fa-star text-[#f47920] mt-1 mr-2"></i>
                                    <span>{benefit}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                      {/* CTA */}
                      <div className="bg-[#002357] rounded-lg shadow-md p-6 text-white mb-8">
                        <h3 className="text-xl font-bold mb-4 font-poppins">Need More Information?</h3>
                        <p className="mb-6">Contact our team of experts to discuss your specific requirements and get a tailored solution.</p>
                        <Link 
                          href="/contact" 
                          className="block w-full bg-[#f47920] hover:bg-[#ff8f3e] text-white text-center font-bold py-3 px-6 rounded-md transition-colors"
                        >
                          Contact Us
                        </Link>
                      </div>
                      
                      {/* Sub-services or related services */}
                      {service.subServices && service.subServices.length > 0 ? (
                        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                          <h3 className="text-xl font-bold text-[#002357] mb-4 font-poppins">Related Services</h3>
                          <ul className="space-y-4">
                            {service.subServices.map(subService => (
                              <li key={subService.id}>
                                <Link 
                                  href={`/services/${subService.slug}`} 
                                  className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                  {subService.image ? (
                                    <div 
                                      className="w-12 h-12 rounded-md bg-cover bg-center mr-3" 
                                      style={{ backgroundImage: `url('${subService.image}')` }}
                                    ></div>
                                  ) : (
                                    <div className="w-12 h-12 rounded-md bg-gray-200 flex items-center justify-center mr-3">
                                      <i className="fas fa-wrench text-gray-400"></i>
                                    </div>
                                  )}
                                  <div className="flex-grow">
                                    <h4 className="font-semibold text-[#002357]">{subService.name}</h4>
                                    <p className="text-sm text-gray-500 line-clamp-1">{subService.description}</p>
                                  </div>
                                  <i className="fas fa-chevron-right text-[#f47920]"></i>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <div className="bg-white rounded-lg shadow-md p-6">
                          <h3 className="text-xl font-bold text-[#002357] mb-4 font-poppins">Our Services</h3>
                          <Link 
                            href="/services" 
                            className="block mb-3 text-[#f47920] hover:text-[#ff8f3e] transition-colors"
                          >
                            <i className="fas fa-arrow-left mr-2"></i> Back to All Services
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>
              
              <ContactCTA />
            </>
          ) : null}
        </main>
        
        <Footer />
      </div>
    </>
  );
}