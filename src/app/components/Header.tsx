"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import logo from "@/assets/images/logo.png";
import Search from "./Search";
import SignInButton from "./SignInButton";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/app/context/ThemeProvider";
import { toast } from "sonner";
import { Sun, Moon } from "lucide-react";
import { Menu } from "./Menu";
import SearchMobile from "./SearchMobile";

function Header() {
  const pathname = usePathname();
  const [SearchNotVisible] = useState(["/", "/login", "/signup", "/event"]);
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
    country: "India",
    city: "Delhi",
  });
  const [search, setSearch] = useState("");
  const { theme, toggleTheme } = useTheme();

  const handleClickSearch = () => {
    // Search Logic
    toast.success("Search Fuctionality will be available soon");
    // console.log(search);
  };

  const handleThemeChange = () => {
    toggleTheme();
    toast.success("Theme changed successfully");
  };

  // Check if search should be visible
  const isSearchVisible = !SearchNotVisible.some(
    (path) => pathname === path || pathname.startsWith("/event/"),
  );

  return (
    <div className="sticky top-0 left-0 right-0 z-50 bg-white dark:bg-zinc-900 transition-all duration-300">
      <nav className="p-5 flex justify-between items-center shadow-xl border-b-[1px] border-zinc-300 relative dark:bg-gradient-to-l from-[#012301] to-[#011701] dark:border-zinc-700 dark:shadow-none bg-transparent backdrop-blur-xl">
        <div className="flex justify-center items-center gap-2 text-lg font-bold text-green-950 dark:text-white">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-all duration-200"
          >
            <Image
              src={logo}
              alt="Logo"
              className="dark:invert"
              style={{ width: "3em", height: "auto", cursor: "pointer" }}
            />
            {/* <span className=" text-[2rem] md:inline">FanLink</span> */}
          </Link>
        </div>

        {/* {isSearchVisible &&
          typeof window !== "undefined" &&
          window.innerWidth > 768 && (
            <div>
              <Search
                search={search}
                setSearch={setSearch}
                location={location}
                setLocation={setLocation}
                handleClickSearch={handleClickSearch}
              />
            </div>
          )} */}

        <div className="flex items-center gap-5 ">
          {isSearchVisible &&
            typeof window !== "undefined" &&
            window.innerWidth <= 768 && (
              <div className="relative">
                <SearchMobile />
              </div>
            )}

          <Menu />

          <SignInButton />

          <div className="hidden md:flex items-center gap-2">
            <Sun className="h-6 w-6" />

            <Switch
              className="h-6 w-12"
              checked={theme === "dark"}
              onCheckedChange={handleThemeChange}
            />

            <Moon className="h-6 w-6" />
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Header;
