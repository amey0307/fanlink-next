'use client';
import { createContext, useContext, useEffect, useState } from "react";

type ThemeContextType = {
    theme: string;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
    //Variable to hold the current theme
    theme: 'dark',

    //Action to toggle the theme
    toggleTheme: () => { },
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState<string>(() => {
        const savedTheme = typeof window !== "undefined" ? localStorage.getItem('theme') : 'dark';
        return savedTheme ? savedTheme : 'dark';
    });

    useEffect(() => {
        // Set the initial theme based on localStorage
        const savedTheme = typeof window !== "undefined" ? localStorage.getItem('theme') : 'dark';
        if (savedTheme) {
            document.documentElement.classList.add(savedTheme);
            document.documentElement.classList.remove(savedTheme === 'light' ? 'dark' : 'light');
        } else {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
        }
    }, []);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
        document.documentElement.classList.add(theme === 'light' ? 'dark' : 'light');
        document.documentElement.classList.remove(theme === 'light' ? 'light' : 'dark');
        localStorage.setItem('theme', theme === 'light' ? 'dark' : 'light');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );

}

export const useTheme = () => useContext(ThemeContext);
