"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import Image from "next/image";

const Navbar = () => {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { data: session } = useSession();

  const handleProfileClick = () => {
    router.push("/profile");
    setIsDropdownOpen(false);
  };

  const handleLogoutClick = async () => {
    await signOut({ redirect: false });
    router.push("/auth/login");
  };

  const handleLogoClick = () => {
    router.push("/");
  };

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div
          className="flex items-center cursor-pointer"
          onClick={handleLogoClick}
        >
          <Image
            src="/assets/logo.png"
            alt="Logo"
            width={25}
            height={25}
            className="mr-2"
          />
          <h1 className="text-2xl font-bold text-gray-800 font-sans">
            Taskify
          </h1>
        </div>
        <div className="flex items-center relative">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-10 w-10 cursor-pointer hover:opacity-80 transition-opacity duration-200 border-2 border-yellow-400">
                {" "}
                {/* Reduced avatar size */}
                <AvatarImage
                  src={session?.user.image || "/assets/fallback.jpeg"}
                  alt="User"
                />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white mr-10 w-40 border border-gray-300 rounded-md shadow-lg mt-2">
              <DropdownMenuItem
                onClick={handleProfileClick}
                className="text-gray-800 text-md hover:bg-gray-200 cursor-pointer hover:text-black transition-colors duration-200 p-2 rounded-md"
              >
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleLogoutClick}
                className="text-gray-800 text-md hover:bg-gray-200 cursor-pointer hover:text-black transition-colors duration-200 p-2 rounded-md"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
