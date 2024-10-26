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
import { getToken } from "next-auth/jwt";

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

  return (
    <header className="bg-[#181818] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-200">Taskify</h1>
        <div className="flex items-center relative">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-12 w-12 cursor-pointer hover:opacity-80 transition-opacity duration-200">
                <AvatarImage
                  src={session?.user.image || "/assets/fallback.jpeg"}
                  alt="User"
                />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#202124] mr-10 w-40 border text-red-600 border-gray-600 rounded-md shadow-lg mt-2">
              <DropdownMenuItem
                onClick={handleProfileClick}
                className="text-gray-200 text-md hover:bg-gray-700 cursor-pointer    hover:text-black transition-colors duration-200 p-2 rounded-md"
              >
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleLogoutClick}
                className="text-gray-200 text-md hover:bg-gray-700 cursor-pointer hover:text-white transition-colors duration-200 p-2 rounded-md"
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
