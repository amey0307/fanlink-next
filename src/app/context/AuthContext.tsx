'use client';
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

const AuthContext = createContext({
    currentUser: null,
    signIn: (user: any) => Promise.resolve(),
    signOut: () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<any>(null);
    const { isSignedIn, user } = useUser();

    // Sync with Clerk's authentication state
    useEffect(() => {
        if (!isSignedIn || !user) {
            // User is signed out in Clerk, clear our context
            setCurrentUser(null);
        }
    }, [isSignedIn, user]);

    const signIn = (user: any): Promise<any> => {
        return new Promise((resolve) => {
            setCurrentUser(user);
            resolve(user);
        });
    };

    const signOut = () => {
        setCurrentUser(null);
    };

    return (
        <AuthContext.Provider value={{ currentUser, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};