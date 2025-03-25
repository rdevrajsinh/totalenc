import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Product } from "@/lib/types";
import { getImagePlaceholder } from "@/lib/utils";

export default function ProductsPreview() {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products/featured'],
  });

  return (
    <section className="py-16 bg-[#002357] text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 font-poppins">Our Products</h2>
          <p className="max-w-3xl mx-auto">
            Discover our comprehensive range of high-quality enclosure solutions designed 
            to meet the demands of various industrial applications.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            // Show skeleton loaders while loading
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow-lg text-gray-800 animate-pulse">
                <div className="h-56 bg-gray-300"></div>
                <div className="p-4">
                  <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))
          ) : products && products.length > 0 ? (
            products.map((product) => (
              <div 
                key={product.id} 
                className="bg-white rounded-lg overflow-hidden shadow-lg text-gray-800 transition-transform hover:transform hover:scale-105"
              >
                <div 
                  className="h-56 bg-cover bg-center" 
                  style={{ backgroundImage: `url('${product.image || getImagePlaceholder('product')}')` }}
                ></div>
                <div className="p-4">
                  <h3 className="font-bold text-[#002357] mb-2 font-poppins">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                  <Link 
                    href={`/products/${product.slug}`} 
                    className="text-[#f47920] hover:text-[#ff8f3e] font-semibold text-sm flex items-center"
                  >
                    View Details <i className="fas fa-arrow-right ml-1"></i>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-4 text-center py-4 bg-white text-gray-500 rounded-lg">
              <p>No products found.</p>
            </div>
          )}
        </div>
        
        <div className="text-center mt-12">
          <Link 
            href="/products" 
            className="inline-block bg-white text-[#002357] hover:bg-neutral-light font-bold py-3 px-6 rounded-md transition-colors"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
