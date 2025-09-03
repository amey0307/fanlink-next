"use client";
import React from "react";
import { Mail, Twitter, Facebook, Linkedin, Youtube } from "lucide-react";
import logo from "@/assets/images/logo.png";
import Link from "next/link";
import Image from "next/image";

function Footer() {
  return (
    <div className="rounded-[100%]">
      <footer className="bg-gray-100 dark:bg-[#0d1307] text-gray-800 dark:text-gray-200 transition-colors duration-300">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Image
                  src={logo}
                  alt="logo"
                  className="dark:invert h-10 w-10"
                />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  FanLink
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Discover amazing events, connect with fellow enthusiasts, and
                create unforgettable memories with FanLink.
              </p>
            </div>

            {/* Categories Section */}
            <div className="hidden md:inline space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                Categories
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/events"
                    className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                  >
                    All Events
                  </Link>
                </li>
                <li>
                  <Link
                    href="/events/music"
                    className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                  >
                    Music
                  </Link>
                </li>
                <li>
                  <Link
                    href="/events/sport"
                    className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                  >
                    Sports
                  </Link>
                </li>
                <li>
                  <Link
                    href="/events/exhibition"
                    className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                  >
                    Exhibitions
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources Section */}
            <div className="hidden md:inline space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                Resources
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/help"
                    className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                  >
                    User Guides
                  </Link>
                </li>
                <li>
                  <Link
                    href="/support"
                    className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/partners"
                    className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                  >
                    Partners
                  </Link>
                </li>
                <li>
                  <Link
                    href="/taxes"
                    className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                  >
                    Tax Information
                  </Link>
                </li>
                <li>
                  <Link
                    href="/organizers"
                    className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                  >
                    For Organizers
                  </Link>
                </li>
              </ul>
            </div>

            {/* Newsletter Section */}
            <div className="hidden md:inline space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                Stay in the loop
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                For product announcements and exclusive insights
              </p>
              <div className="flex">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="email"
                    placeholder="Input your email"
                    className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  />
                </div>
                <button className="px-4 py-2 bg-gray-700 dark:bg-gray-600 text-white rounded-r-md hover:bg-gray-800 dark:hover:bg-gray-500 transition-colors text-sm font-medium">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-300 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              {/* Left Side - Language & Copyright */}
              <div className="flex items-center space-x-6">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  © 2024 FanLink, Inc. •
                  <Link
                    href="/privacy"
                    className="hover:text-green-600 dark:hover:text-green-400 transition-colors ml-1"
                  >
                    Privacy
                  </Link>{" "}
                  •
                  <Link
                    href="/terms"
                    className="hover:text-green-600 dark:hover:text-green-400 transition-colors ml-1"
                  >
                    Terms
                  </Link>{" "}
                  •
                  <Link
                    href="/sitemap"
                    className="hover:text-green-600 dark:hover:text-green-400 transition-colors ml-1"
                  >
                    Sitemap
                  </Link>
                </div>
              </div>

              {/* Right Side - Social Media */}
              <div className="flex items-center space-x-4">
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </Link>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </Link>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </Link>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                ></Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
