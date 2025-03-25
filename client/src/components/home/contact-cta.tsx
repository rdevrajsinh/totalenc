import { Link } from "wouter";

export default function ContactCTA() {
  return (
    <section className="py-16 bg-[#f47920]">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4 font-poppins">Ready to Discuss Your Project?</h2>
          <p className="max-w-3xl mx-auto text-white mb-8">
            Our team of experts is ready to help you find the perfect enclosure solution 
            for your specific needs. Contact us today for a consultation.
          </p>
          <Link 
            href="/contact" 
            className="inline-block bg-white text-[#f47920] hover:bg-gray-100 font-bold py-3 px-8 rounded-md transition-colors"
          >
            Contact Us Now
          </Link>
        </div>
      </div>
    </section>
  );
}
