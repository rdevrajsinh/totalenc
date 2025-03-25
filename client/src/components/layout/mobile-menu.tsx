import { useState } from "react";
import { Link } from "wouter";
import { NavItem } from "@/lib/types";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
}

export default function MobileMenu({ isOpen, onClose, navItems }: MobileMenuProps) {
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});

  const toggleDropdown = (label: string) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="lg:hidden bg-white w-full absolute top-full left-0 shadow-md">
      <div className="container mx-auto px-4 py-2">
        <Link href="/" className="block py-3 border-b border-gray-200 font-poppins text-primary hover:text-secondary" onClick={onClose}>
          Home
        </Link>
        
        {navItems.slice(1).map((item, index) => (
          item.children ? (
            <div key={index} className="py-3 border-b border-gray-200">
              <button 
                className="w-full text-left font-poppins text-primary hover:text-secondary flex justify-between items-center"
                onClick={() => toggleDropdown(item.label)}
              >
                {item.label} 
                <i className={`fas fa-chevron-${openDropdowns[item.label] ? 'up' : 'down'} text-xs`}></i>
              </button>
              <div className={`${openDropdowns[item.label] ? 'block' : 'hidden'} py-2 pl-4`}>
                {item.children.map((child, childIndex) => (
                  <Link 
                    key={childIndex} 
                    href={child.href} 
                    className="block py-2 text-sm text-gray-700 hover:text-secondary"
                    onClick={onClose}
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
              className="block py-3 border-b border-gray-200 font-poppins text-primary hover:text-secondary"
              onClick={onClose}
            >
              {item.label}
            </Link>
          )
        ))}
      </div>
    </div>
  );
}
