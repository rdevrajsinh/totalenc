import { Helmet } from 'react-helmet';
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ContactCTA from "@/components/home/contact-cta";
import { getImagePlaceholder } from "@/lib/utils";

export default function CaseStudiesPage() {
  // Sample case studies data (in a real app, this would come from an API)
  const caseStudies = [
    {
      id: 1,
      title: "Custom Enclosure Solution for Pharmaceutical Manufacturing",
      description: "How we helped a leading pharmaceutical company protect sensitive equipment in a demanding manufacturing environment.",
      industry: "Pharmaceutical",
      solution: "Custom Stainless Steel Enclosures",
      image: getImagePlaceholder("product")
    },
    {
      id: 2,
      title: "Weatherproof Enclosures for Offshore Wind Farm",
      description: "Developing corrosion-resistant enclosures that withstand extreme marine conditions for renewable energy applications.",
      industry: "Renewable Energy",
      solution: "Marine-Grade Aluminum Enclosures",
      image: getImagePlaceholder("product")
    },
    {
      id: 3,
      title: "Modular Control Panel System for Manufacturing Plant",
      description: "Design and implementation of a scalable control panel system for a large-scale manufacturing facility.",
      industry: "Manufacturing",
      solution: "Modular Control Panels",
      image: getImagePlaceholder("product")
    }
  ];

  return (
    <>
      <Helmet>
        <title>Case Studies | Total Enclosures</title>
        <meta name="description" content="Explore our successful case studies showcasing custom enclosure solutions across various industries and applications." />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Open+Sans:wght@400;600&display=swap" rel="stylesheet" />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow pt-32">
          {/* Page Header */}
          <section className="bg-[#002357] py-16 text-white">
            <div className="container mx-auto px-4">
              <h1 className="text-4xl font-bold mb-4 font-poppins">Case Studies</h1>
              <p className="text-xl max-w-3xl">
                Explore our successful projects and learn how we've helped clients across various industries solve their enclosure challenges.
              </p>
            </div>
          </section>
          
          {/* Case Studies Listing */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 gap-12">
                {caseStudies.map((study, index) => (
                  <div key={study.id} className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} bg-white shadow-lg rounded-lg overflow-hidden`}>
                    <div className="lg:w-1/2">
                      <div 
                        className="h-80 bg-cover bg-center" 
                        style={{ backgroundImage: `url('${study.image}')` }}
                      ></div>
                    </div>
                    <div className="lg:w-1/2 p-8">
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                          {study.industry}
                        </span>
                        <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
                          {study.solution}
                        </span>
                      </div>
                      <h2 className="text-2xl font-bold text-[#002357] mb-4 font-poppins">{study.title}</h2>
                      <p className="text-gray-600 mb-6">{study.description}</p>
                      <a href={`/case-studies/${study.id}`} className="inline-block bg-[#f47920] hover:bg-[#ff8f3e] text-white font-bold py-2 px-4 rounded-md transition-colors">
                        Read Case Study
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          
          {/* Industries Served */}
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-[#002357] mb-4 font-poppins">Industries We Serve</h2>
                <p className="max-w-3xl mx-auto text-gray-600">
                  We provide enclosure solutions for a wide range of industries, each with its own unique requirements and challenges.
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow">
                  <div className="text-[#002357] mb-3">
                    <i className="fas fa-industry text-4xl"></i>
                  </div>
                  <h3 className="font-bold text-gray-800">Manufacturing</h3>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow">
                  <div className="text-[#002357] mb-3">
                    <i className="fas fa-bolt text-4xl"></i>
                  </div>
                  <h3 className="font-bold text-gray-800">Energy</h3>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow">
                  <div className="text-[#002357] mb-3">
                    <i className="fas fa-flask text-4xl"></i>
                  </div>
                  <h3 className="font-bold text-gray-800">Pharmaceutical</h3>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow">
                  <div className="text-[#002357] mb-3">
                    <i className="fas fa-microchip text-4xl"></i>
                  </div>
                  <h3 className="font-bold text-gray-800">Technology</h3>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow">
                  <div className="text-[#002357] mb-3">
                    <i className="fas fa-water text-4xl"></i>
                  </div>
                  <h3 className="font-bold text-gray-800">Water Treatment</h3>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow">
                  <div className="text-[#002357] mb-3">
                    <i className="fas fa-broadcast-tower text-4xl"></i>
                  </div>
                  <h3 className="font-bold text-gray-800">Telecommunications</h3>
                </div>
              </div>
            </div>
          </section>
          
          {/* Call to Action */}
          <section className="py-16">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold text-[#002357] mb-6 font-poppins">Have a Similar Project?</h2>
              <p className="max-w-3xl mx-auto text-gray-600 mb-8">
                We'd love to discuss how we can help you overcome your enclosure challenges and develop a tailored solution for your specific needs.
              </p>
              <a href="/contact" className="inline-block bg-[#f47920] hover:bg-[#ff8f3e] text-white font-bold py-3 px-8 rounded-md transition-colors">
                Discuss Your Project
              </a>
            </div>
          </section>
          
          <ContactCTA />
        </main>
        
        <Footer />
      </div>
    </>
  );
}
