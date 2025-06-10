import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./context/ThemeProvider";
import { DatabaseProvider } from "./providers";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "@/components/ui/sonner"
import { useTheme } from "./context/ThemeProvider";

import {
  ClerkProvider,
} from '@clerk/nextjs'
import Header from "./components/Header";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FanLink",
  description: "Connect to you favourite artists and their content",
};

const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const theme = typeof window !== "undefined" ? localStorage.getItem("theme") || "dark" : "dark";

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

export default function RootLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" webcrx="">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
          <AuthProvider>
            <DatabaseProvider>
              <ThemeProvider>
                <Header />
                {children}
                <Footer />
                <Toaster position="bottom-right" offset={{ top: "100px" }} />
              </ThemeProvider>
            </DatabaseProvider>
          </AuthProvider>
        </ClerkProvider>

      </body>
    </html>
  );
}
