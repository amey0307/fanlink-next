'use client';

import React from "react";
import { useTheme } from "@/app/context/ThemeProvider";

interface SuccessProps {
    topic: string;
    description: string;
}

const Success: React.FC<SuccessProps> = ({ topic, description }) => {
    const { theme } = useTheme();

    return (
        <div className={`text-6xl font-bold text-center ${theme}`}>
            <div className="dark:bg-gradient-to-br from-green-950 to-[#000000] min-h-screen dark:text-white py-4">
                <p>{topic}</p>
                <span
                    role="img"
                    aria-label="emoji"
                    className="text-2xl bg-green-300 p-2 rounded-sm text-black"
                >
                    {description}
                </span>
            </div>
        </div>
    );
}

export default Success;
