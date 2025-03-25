import { Link } from "wouter";
import { getImagePlaceholder } from "@/lib/utils";

export default function Hero() {
  return (
    <section className="relative h-[500px] bg-gray-800 overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${getImagePlaceholder('hero')}')` }}
      ></div>
      
      <div className="container mx-auto px-4 h-full flex items-center relative z-20">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-poppins">Industrial Enclosures & Cabinet Solutions</h1>
          <p className="text-xl text-white mb-8">Providing quality enclosure solutions for over 25 years</p>
          <div className="flex flex-wrap gap-4">
            <Link 
              href="/products" 
              className="bg-[#f47920] hover:bg-[#ff8f3e] text-white font-bold py-3 px-6 rounded-md transition-colors"
            >
              Explore Products
            </Link>
            <Link 
              href="/contact" 
              className="border-2 border-white text-white hover:bg-white hover:text-[#002357] font-bold py-3 px-6 rounded-md transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
