"use client"

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { Layers, Settings, Shirt, ShoppingBag, Users, Home } from "lucide-react";

const navLinks = [
  { url: "/", label: "Home", icon: <Home className="w-5 h-5" /> },
  { url: "/collections", label: "Collections", icon: <Layers className="w-5 h-5" /> },
  { url: "/products", label: "Products", icon: <Shirt className="w-5 h-5" /> },
  { url: "/orders", label: "Orders", icon: <ShoppingBag className="w-5 h-5" /> },
  { url: "/customers", label: "Customers", icon: <Users className="w-5 h-5" /> },
];

const LeftSideBar = () => {
  const pathname = usePathname();
  const { isSignedIn, user } = useUser();

  return (
    <div className="h-screen left-0 top-0 sticky p-8 flex flex-col gap-16 bg-[#f8f3ed] shadow-lg border-r border-gray-200 max-lg:hidden">
      {/* Logo */}
      <div className="px-4 pt-4">
        <Image 
          src="/sara2.png" 
          alt="Asim Jofa" 
          width={180} 
          height={80}
          className="object-contain"
        />
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col gap-6">
        {navLinks.map((link) => (
          <Link
            href={link.url}
            key={link.label}
            className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${
              pathname === link.url 
                ? "bg-[#b89d7a] text-white" 
                : "text-[#2a2a2a] hover:bg-[#b89d7a]/10 hover:text-[#b89d7a]"
            }`}
          >
            <span className={`${pathname === link.url ? "text-white" : "text-[#b89d7a]"}`}>
              {link.icon}
            </span>
            <span className="text-sm font-medium tracking-wider">
              {link.label}
            </span>
          </Link>
        ))}
      </div>

      {/* User Profile */}
      <div className="mt-auto px-4 pb-8">
        <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-[#b89d7a]/10 transition-colors">
          <div className="relative w-10 h-10 rounded-full border border-[#b89d7a] flex items-center justify-center">
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                }
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#2a2a2a] truncate">
              {user?.fullName || "Account"}
            </p>
            <Link 
              href="/profile" 
              className="flex items-center gap-2 text-xs text-[#b89d7a] hover:text-[#9c8360] transition-colors"
            >
              <Settings className="w-3 h-3" />
              Edit Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftSideBar;