"use client"

import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, Crown, Layers, Shirt, ShoppingBag, Users, Home as HomeIcon } from "lucide-react";

// import { navLinks } from "@/lib/constants";
const navLinks = [
  { url: "/", label: "Home", icon: <HomeIcon className="w-5 h-5" /> },
  { url: "/collections", label: "Collections", icon: <Layers  className="w-5 h-5" /> },
  { url: "/products", label: "Products", icon: <Shirt className="w-5 h-5" /> },
  { url: "/orders", label: "Orders", icon: <ShoppingBag className="w-5 h-5" /> },
  { url: "/customers", label: "Customers", icon: <Users className="w-5 h-5" /> },
];

const TopBar = () => {
  const [dropdownMenu, setDropdownMenu] = useState(false);
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-50 w-full flex justify-between items-center px-8 py-4 bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg border-b border-gold-500 lg:hidden">
      {/* Logo with Luxury Branding */}
      <div className="flex items-center gap-3">
        <Crown className="w-8 h-8 text-gold-500" />
        <Image 
          src="/logo.png" 
          alt="logo" 
          width={150} 
          height={70}
          className="filter brightness-0 invert-[0.85]"
        />
      </div>

      {/* Desktop Navigation */}
      <div className="flex gap-8 max-md:hidden">
        {navLinks.map((link) => (
          <Link
            href={link.url}
            key={link.label}
            className={`flex gap-3 items-center font-medium transition-colors ${
              pathname === link.url 
                ? "text-gold-400 border-b-2 border-gold-400" 
                : "text-gray-300 hover:text-gold-300"
            }`}
          >
            {link.icon}
            <span className="font-playfair">{link.label}</span>
          </Link>
        ))}
      </div>

      {/* Mobile Menu and User Button */}
      <div className="relative flex gap-6 items-center">
        <Menu
          className="cursor-pointer text-gold-400 hover:text-gold-300 md:hidden w-8 h-8"
          onClick={() => setDropdownMenu(!dropdownMenu)}
        />
        
        {/* Mobile Dropdown Menu */}
        {dropdownMenu && (
          <div className="absolute top-12 right-0 flex flex-col gap-4 p-6 bg-gray-800 shadow-2xl rounded-lg border border-gold-500 min-w-[200px]">
            {navLinks.map((link) => (
              <Link
                href={link.url}
                key={link.label}
                onClick={() => setDropdownMenu(false)}
                className={`flex gap-3 items-center py-2 px-3 rounded-md transition-colors ${
                  pathname === link.url
                    ? "bg-gold-500/10 text-gold-400"
                    : "text-gray-300 hover:bg-gray-700 hover:text-gold-300"
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </div>
        )}
        
        {/* Enhanced User Button */}
        <div className="border-2 border-gold-500 rounded-full p-1">
          <UserButton 
            appearance={{
              elements: {
                userButtonAvatarBox: "w-9 h-9",
                userButtonPopoverCard: "bg-gray-800 border border-gold-500",
                userButtonPopoverActionButtonText: "text-gray-300 hover:text-gold-300",
                userButtonPopoverFooter: "hidden"
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TopBar;