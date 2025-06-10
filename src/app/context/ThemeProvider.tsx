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
    const [theme, setTheme] = useState<string>('dark');

    useEffect(() => {
        // Check if the user has a preferred theme stored in localStorage
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            setTheme(storedTheme);
            document.documentElement.classList.add(storedTheme);
        } else {
            // Default to dark theme if no preference is stored
            setTheme('dark');
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
        document.documentElement.classList.add(theme === 'dark' ? 'light' : 'dark');
        document.documentElement.classList.remove(theme === 'dark' ? 'dark' : 'light');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );

}

export const useTheme = () => useContext(ThemeContext);
