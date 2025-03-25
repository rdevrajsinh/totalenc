import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Service } from "@/lib/types";
import { getImagePlaceholder } from "@/lib/utils";

export default function Services() {
  const { data: services, isLoading } = useQuery<Service[]>({
    queryKey: ['/api/services/featured'],
  });

  return (
    <section className="py-16 bg-neutral-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#002357] mb-4 font-poppins">Our Services</h2>
          <p className="max-w-3xl mx-auto text-gray-600">
            We offer a comprehensive range of services to meet all your enclosure needs, 
            from standard products to fully customized solutions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            // Show skeleton loaders while loading
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))
          ) : services && services.length > 0 ? (
            services.map((service) => (
              <div 
                key={service.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:transform hover:scale-105"
              >
                <div 
                  className="h-48 bg-cover bg-center" 
                  style={{ backgroundImage: `url('${service.image || getImagePlaceholder('service')}')` }}
                ></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#002357] mb-2 font-poppins">{service.name}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <Link 
                    href={`/services/${service.slug}`} 
                    className="text-[#f47920] hover:text-[#ff8f3e] font-semibold flex items-center"
                  >
                    Learn More <i className="fas fa-arrow-right ml-2"></i>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-4">
              <p className="text-gray-500">No services found.</p>
            </div>
          )}
        </div>
        
        <div className="text-center mt-12">
          <Link 
            href="/services" 
            className="inline-block bg-[#002357] hover:bg-[#003a8c] text-white font-bold py-3 px-6 rounded-md transition-colors"
          >
            View All Services
          </Link>
        </div>
      </div>
    </section>
  );
}
