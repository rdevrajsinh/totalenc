import Hero from "@/components/home/hero";
import Services from "@/components/home/services";
import About from "@/components/home/about";
import ProductsPreview from "@/components/home/products-preview";
import BlogPreview from "@/components/home/blog-preview";
import ContactCTA from "@/components/home/contact-cta";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Helmet } from 'react-helmet';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Total Enclosures - Industrial Enclosures & Cabinets</title>
        <meta name="description" content="Total Enclosures provides high-quality industrial enclosure solutions, cabinets, and custom designs for various industrial applications." />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Open+Sans:wght@400;600&display=swap" rel="stylesheet" />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow pt-32">
          <Hero />
          <Services />
          <About />
          <ProductsPreview />
          <BlogPreview />
          <ContactCTA />
        </main>
        
        <Footer />
      </div>
    </>
  );
}
