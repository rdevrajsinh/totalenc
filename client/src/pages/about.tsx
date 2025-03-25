import { Helmet } from 'react-helmet';
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ContactCTA from "@/components/home/contact-cta";
import { getImagePlaceholder } from "@/lib/utils";

export default function About() {
  return (
    <>
      <Helmet>
        <title>About Us | Total Enclosures</title>
        <meta name="description" content="Learn about Total Enclosures, our history, our team, and our commitment to providing high-quality industrial enclosure solutions for over 25 years." />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Open+Sans:wght@400;600&display=swap" rel="stylesheet" />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow pt-32">
          {/* Page Header */}
          <section className="bg-[#002357] py-16 text-white">
            <div className="container mx-auto px-4">
              <h1 className="text-4xl font-bold mb-4 font-poppins">About Us</h1>
              <p className="text-xl max-w-3xl">
                Learn about our company, our journey, and our commitment to excellence.
              </p>
            </div>
          </section>
          
          {/* Company History */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="md:w-1/2">
                  <h2 className="text-3xl font-bold text-[#002357] mb-4 font-poppins">Our Story</h2>
                  <p className="text-gray-600 mb-4">
                    Founded in 1998, Total Enclosures has grown from a small workshop to a leading provider of industrial enclosure solutions across the United Kingdom and Europe.
                  </p>
                  <p className="text-gray-600 mb-4">
                    Our journey began with a simple mission: to provide high-quality, reliable enclosures that meet the specific needs of our customers. Over the past 25+ years, we have expanded our product range, enhanced our manufacturing capabilities, and built a team of experts dedicated to delivering exceptional service.
                  </p>
                  <p className="text-gray-600">
                    Today, we continue to innovate and adapt to the changing needs of industries, while maintaining our commitment to quality, reliability, and customer satisfaction.
                  </p>
                </div>
                <div className="md:w-1/2">
                  <img 
                    src={getImagePlaceholder('default')} 
                    alt="Total Enclosures factory" 
                    className="rounded-lg shadow-lg w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </section>
          
          {/* Our Mission & Values */}
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-[#002357] mb-4 font-poppins">Our Mission & Values</h2>
                <p className="max-w-3xl mx-auto text-gray-600">
                  We are guided by a clear mission and strong values that shape everything we do.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="text-[#f47920] mb-4">
                    <i className="fas fa-bullseye text-3xl"></i>
                  </div>
                  <h3 className="text-xl font-bold text-[#002357] mb-3 font-poppins">Our Mission</h3>
                  <p className="text-gray-600">
                    To provide innovative, high-quality enclosure solutions that protect and enhance our customers' equipment, while delivering exceptional service and value.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="text-[#f47920] mb-4">
                    <i className="fas fa-eye text-3xl"></i>
                  </div>
                  <h3 className="text-xl font-bold text-[#002357] mb-3 font-poppins">Our Vision</h3>
                  <p className="text-gray-600">
                    To be the premier provider of enclosure solutions, recognized for our innovation, quality, and commitment to exceeding customer expectations.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="text-[#f47920] mb-4">
                    <i className="fas fa-handshake text-3xl"></i>
                  </div>
                  <h3 className="text-xl font-bold text-[#002357] mb-3 font-poppins">Core Values</h3>
                  <ul className="text-gray-600 space-y-2">
                    <li>• Quality in everything we do</li>
                    <li>• Integrity in our relationships</li>
                    <li>• Innovation in our solutions</li>
                    <li>• Customer satisfaction above all</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
          
          {/* Our Team */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-[#002357] mb-4 font-poppins">Our Leadership Team</h2>
                <p className="max-w-3xl mx-auto text-gray-600">
                  Meet the experienced professionals who lead our company toward excellence.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Team Member 1 */}
                <div className="text-center">
                  <div className="mb-4 rounded-full overflow-hidden w-40 h-40 mx-auto">
                    <img 
                      src={getImagePlaceholder('profile')} 
                      alt="John Smith" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-[#002357] font-poppins">John Smith</h3>
                  <p className="text-[#f47920] font-medium mb-2">CEO & Founder</p>
                  <p className="text-gray-600 text-sm">
                    With over 30 years of industry experience, John leads our company with vision and expertise.
                  </p>
                </div>
                
                {/* Team Member 2 */}
                <div className="text-center">
                  <div className="mb-4 rounded-full overflow-hidden w-40 h-40 mx-auto">
                    <img 
                      src={getImagePlaceholder('profile')} 
                      alt="Sarah Johnson" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-[#002357] font-poppins">Sarah Johnson</h3>
                  <p className="text-[#f47920] font-medium mb-2">Operations Director</p>
                  <p className="text-gray-600 text-sm">
                    Sarah ensures our manufacturing processes meet the highest standards of quality and efficiency.
                  </p>
                </div>
                
                {/* Team Member 3 */}
                <div className="text-center">
                  <div className="mb-4 rounded-full overflow-hidden w-40 h-40 mx-auto">
                    <img 
                      src={getImagePlaceholder('profile')} 
                      alt="Michael Brown" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-[#002357] font-poppins">Michael Brown</h3>
                  <p className="text-[#f47920] font-medium mb-2">Technical Director</p>
                  <p className="text-gray-600 text-sm">
                    Michael leads our engineering team, driving innovation and technical excellence in our products.
                  </p>
                </div>
                
                {/* Team Member 4 */}
                <div className="text-center">
                  <div className="mb-4 rounded-full overflow-hidden w-40 h-40 mx-auto">
                    <img 
                      src={getImagePlaceholder('profile')} 
                      alt="Emma Wilson" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-[#002357] font-poppins">Emma Wilson</h3>
                  <p className="text-[#f47920] font-medium mb-2">Sales & Marketing Director</p>
                  <p className="text-gray-600 text-sm">
                    Emma builds strong customer relationships and drives our growth strategies.
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
