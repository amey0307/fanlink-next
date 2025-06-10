'use client';
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext({
    currentUser: null,
    signIn: (signIn: (user: any) => void) => { },
    signOut: () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentUser, setCurrentUser] = useState({} as any);

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