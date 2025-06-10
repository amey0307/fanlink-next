'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import logo from '@/assets/images/logo.png';
import Search from './Search';
import SignInButton from './SignInButton';
import { Switch } from "@/components/ui/switch"
import { useTheme } from '@/app/context/ThemeProvider';
import { toast } from "sonner"
import { Sun, Moon } from 'lucide-react';
import { Menu } from './Menu';


function Header() {
    const pathname = usePathname();
    const [SearchNotVisible] = useState([
        '/',
        '/login',
        '/signup',
        '/event'
    ]);
    const [location, setLocation] = useState({
        latitude: 0,
        longitude: 0,
        country: 'India',
        city: 'Delhi'
    });
    const [search, setSearch] = useState('');
    const { theme, toggleTheme } = useTheme();

    const handleClickSearch = () => {
        // Search Logic
        console.log(search);
    };

    const handleThemeChange = () => {
        toggleTheme();
        toast.success("Theme changed successfully");
    };

    // Check if search should be visible
    const isSearchVisible = !SearchNotVisible.some(path =>
        pathname === path || pathname.startsWith('/event/')
    );

    return (
        <div className='sticky -top-0 left-0 right-0 z-50 bg-white dark:bg-zinc-900 transition-all duration-300'>
            <nav className='p-5 flex justify-between items-center shadow-xl border-b-[1px] border-zinc-300 relative dark:bg-gradient-to-l from-green-950 to-[#011701] fixed top-0 left-0 right-0 bg-white dark:border-zinc-700 dark:shadow-none'>
                <Link href="/">
                    <Image
                        src={logo}
                        alt="Logo"
                        className='w-[3vw] cursor-pointer hover:opacity-70 transition-all duration-200 dark:invert'
                        style={{ width: '3vw', height: 'auto', cursor: 'pointer' }}
                    />
                </Link>

                {isSearchVisible && (
                    <Search
                        search={search}
                        setSearch={setSearch}
                        location={location}
                        setLocation={setLocation}
                        handleClickSearch={handleClickSearch}
                    />
                )}

                <div className='flex items-center gap-5 '>
                    <SignInButton />
                    <Menu />

                    <div className='flex items-center gap-2'>
                        <Sun className='h-6 w-6' />

                        <Switch className='h-6 w-12'
                            defaultChecked={typeof window !== "undefined" && localStorage.getItem('theme') === 'dark'}
                            onCheckedChange={handleThemeChange} />

                        <Moon className='h-6 w-6' />
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Header;