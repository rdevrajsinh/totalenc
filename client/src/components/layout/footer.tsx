import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 font-poppins">Total Enclosures</h3>
            <p className="mb-4">
              Providing high-quality industrial enclosure solutions for over 25 years. 
              Our commitment to excellence ensures that we deliver products that meet your specific requirements.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-secondary">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-white hover:text-secondary">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-white hover:text-secondary">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="#" className="text-white hover:text-secondary">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 font-poppins">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-secondary">Home</Link></li>
              <li><Link href="/about" className="hover:text-secondary">About Us</Link></li>
              <li><Link href="/products" className="hover:text-secondary">Products</Link></li>
              <li><Link href="/services" className="hover:text-secondary">Services</Link></li>
              <li><Link href="/case-studies" className="hover:text-secondary">Case Studies</Link></li>
              <li><Link href="/blog" className="hover:text-secondary">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-secondary">Contact</Link></li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-xl font-bold mb-4 font-poppins">Products</h3>
            <ul className="space-y-2">
              <li><Link href="/products/metal-enclosures" className="hover:text-secondary">Metal Enclosures</Link></li>
              <li><Link href="/products/stainless-steel-cabinets" className="hover:text-secondary">Stainless Steel Cabinets</Link></li>
              <li><Link href="/products/plastic-enclosures" className="hover:text-secondary">Plastic Enclosures</Link></li>
              <li><Link href="/products/control-panels" className="hover:text-secondary">Control Panels</Link></li>
              <li><Link href="/products/junction-boxes" className="hover:text-secondary">Junction Boxes</Link></li>
              <li><Link href="/products/custom-enclosures" className="hover:text-secondary">Custom Solutions</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 font-poppins">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt mt-1 mr-3 text-secondary"></i>
                <span>123 Industrial Way, Derbyshire, DE12 3AB, United Kingdom</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone-alt mr-3 text-secondary"></i>
                <a href="tel:+441283499380" className="hover:text-secondary">+44 (0) 1283 499380</a>
              </li>
              <li className="flex items-center">
                <i className="fas fa-envelope mr-3 text-secondary"></i>
                <a href="mailto:info@totalenc.com" className="hover:text-secondary">info@totalenc.com</a>
              </li>
              <li className="flex items-center">
                <i className="fas fa-clock mr-3 text-secondary"></i>
                <span>Mon-Fri: 9:00 AM - 5:30 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-gray-700 my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} Total Enclosures. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            <Link href="/privacy-policy" className="hover:text-secondary mr-4">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-secondary">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
