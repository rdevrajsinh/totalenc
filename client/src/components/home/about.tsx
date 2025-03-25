import { Link } from "wouter";
import { getImagePlaceholder } from "@/lib/utils";

export default function About() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img 
                src={getImagePlaceholder('default')} 
                alt="About Total Enclosures" 
                className="w-full h-auto"
              />
            </div>
          </div>
          
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold text-[#002357] mb-4 font-poppins">About Total Enclosures</h2>
            <p className="text-gray-600 mb-4">
              Total Enclosures has been providing high-quality industrial enclosure solutions 
              for over 25 years. We are dedicated to delivering exceptional products and 
              services to our clients across various industries.
            </p>
            <p className="text-gray-600 mb-6">
              Our team of experts works closely with you to understand your specific 
              requirements and provide tailored solutions that meet your needs and exceed 
              your expectations.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start">
                <div className="text-[#f47920] mr-4">
                  <i className="fas fa-check-circle text-2xl"></i>
                </div>
                <div>
                  <h4 className="font-bold text-[#002357] mb-1 font-poppins">Quality Assured</h4>
                  <p className="text-sm text-gray-600">All our products meet the highest industry standards</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="text-[#f47920] mr-4">
                  <i className="fas fa-check-circle text-2xl"></i>
                </div>
                <div>
                  <h4 className="font-bold text-[#002357] mb-1 font-poppins">Expert Team</h4>
                  <p className="text-sm text-gray-600">Skilled professionals with decades of experience</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="text-[#f47920] mr-4">
                  <i className="fas fa-check-circle text-2xl"></i>
                </div>
                <div>
                  <h4 className="font-bold text-[#002357] mb-1 font-poppins">Custom Solutions</h4>
                  <p className="text-sm text-gray-600">Tailored enclosures to meet your specific needs</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="text-[#f47920] mr-4">
                  <i className="fas fa-check-circle text-2xl"></i>
                </div>
                <div>
                  <h4 className="font-bold text-[#002357] mb-1 font-poppins">Timely Delivery</h4>
                  <p className="text-sm text-gray-600">Reliable service within agreed timeframes</p>
                </div>
              </div>
            </div>
            
            <Link 
              href="/about" 
              className="inline-block bg-[#f47920] hover:bg-[#ff8f3e] text-white font-bold py-3 px-6 rounded-md transition-colors"
            >
              Learn More About Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
