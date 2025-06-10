import React, { useEffect, useState } from 'react';
import { useUser, useClerk, UserButton } from '@clerk/clerk-react';
import { useAuth } from '../context/AuthContext';
import { Skeleton } from "@/components/ui/skeleton";
import { LucideUser } from 'lucide-react';

function SignInButton() {
    const { openSignIn } = useClerk();
    const { isSignedIn, user } = useUser();
    const { signIn } = useAuth() as { signIn: (user: any) => void };
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isSignedIn !== undefined) {
            setLoading(false);
            if (isSignedIn) {
                signIn(user);
                // console.log("CurrentUser Updated: ", user);
            }
        }
    }, [isSignedIn, user, signIn]);

    const handleSignIn = () => {
        openSignIn({
            afterSignInUrl: '/', // Redirect here after sign-in
            afterSignUpUrl: '/', // Redirect here after sign-up
        });
    };

    if (loading) {
        return (
            <Skeleton className='h-12 w-24' />
        );
    }

    if (isSignedIn) {
        return (
            <div className='scale-[1.7] mr-6 mt-2'>
                <UserButton />
            </div>
        );
    }

    return (
        <button
            onClick={handleSignIn}
            className='border-[1px] text-white dark:text-black bg-[#0b270ff3] rounded-sm hover:bg-white hover:text-black transition-all duration-300 py-[5px] px-2 dark:bg-[#081b0b78] dark:text-white dark:hover:text-black dark:hover:bg-white flex items-center justify-center gap-2 hover:scale-105 text-md cursor-pointer'
        >
            <LucideUser size={18} />  Sign In
        </button>
    );
}

export default SignInButton;