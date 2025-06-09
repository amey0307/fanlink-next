"use client";

import { useEffect } from 'react';
import mongoDB_Connection from '@/app/model/db';

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const connect = async () => {
            await mongoDB_Connection();
        };
        connect();
    }, []);

    return <>{children}</>;
}