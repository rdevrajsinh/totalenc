import { useState } from "react";
import { Link, useLocation } from "wouter";
import { NavItem } from "@/lib/types";
import MobileMenu from "./mobile-menu";

// Main navigation items
const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About",
    href: "/about",
    children: [
      { label: "About Us", href: "/about" },
      { label: "Our Team", href: "/team" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    label: "Products",
    href: "/products",
    children: [
      { label: "Enclosures", href: "/products/enclosures" },
      { label: "Cabinets", href: "/products/cabinets" },
      { label: "Custom Solutions", href: "/products/custom" },
    ],
  },
  { label: "Services", href: "/services" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow-md fixed top-0 z-50">
      {/* Top Bar */}
      <div className="bg-primary text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="hidden md:flex items-center space-x-4">
            <a href="tel:+441283499380" className="flex items-center text-sm">
              <i className="fas fa-phone-alt mr-2"></i>
              +44 (0) 1283 499380
            </a>
            <a href="mailto:info@totalenc.com" className="flex items-center text-sm">
              <i className="fas fa-envelope mr-2"></i>
              info@totalenc.com
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <a href="#" className="text-white hover:text-secondary">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="text-white hover:text-secondary">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="text-white hover:text-secondary">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <div 
            className="h-14 w-48 bg-contain bg-no-repeat" 
            style={{ backgroundImage: `url('https://placehold.co/600x400/002357/FFF?text=Total+Enclosures')` }}
          >
            {/* Logo placeholder */}
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-8">
          {navItems.map((item, index) => (
            item.children ? (
              <div key={index} className="dropdown relative">
                <button className="font-poppins text-primary hover:text-secondary font-medium flex items-center">
                  {item.label} <i className="fas fa-chevron-down ml-1 text-xs"></i>
                </button>
                <div className="dropdown-menu absolute hidden bg-white mt-2 py-2 w-48 shadow-lg rounded-md z-50">
                  {item.children.map((child, childIndex) => (
                    <Link 
                      key={childIndex} 
                      href={child.href}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-neutral-light"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link 
                key={index} 
                href={item.href}
                className={`font-poppins font-medium ${
                  location === item.href 
                    ? "text-secondary" 
                    : "text-primary hover:text-secondary"
                }`}
              >
                {item.label}
              </Link>
            )
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden text-primary focus:outline-none"
          onClick={() => setMobileMenuOpen(true)}
        >
          <i className="fas fa-bars text-2xl"></i>
        </button>
      </nav>

      {/* Mobile Navigation */}
      <MobileMenu 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
        navItems={navItems} 
      />
    </header>
  );
}
