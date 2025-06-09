"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./components/ui/button";
import { useTheme } from "./context/ThemeProvider";
import Dashboard from "./dashboard/page";

export default function Home() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div>
      <Dashboard/>
    </div>
  );
}