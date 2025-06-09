import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./context/ThemeProvider";
import { DatabaseProvider } from "./providers";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "@/components/ui/sonner"


import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import Header from "./components/Header";

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
                <Toaster position="bottom-right" expand={true} />
              </ThemeProvider>
            </DatabaseProvider>
          </AuthProvider>
        </ClerkProvider>

      </body>
    </html>
  );
}
