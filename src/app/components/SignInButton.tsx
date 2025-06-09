import React, { useEffect, useState } from 'react';
import { useUser, useClerk, UserButton } from '@clerk/clerk-react';
import { useAuth } from '../context/AuthContext';
import { Skeleton } from "@/components/ui/skeleton";

function SignInButton() {
    const { openSignIn } = useClerk();
    const { isSignedIn, user } = useUser();
    const { signIn, currentUser } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isSignedIn !== undefined) {
            setLoading(false);
            if (isSignedIn) {
                signIn(user);
                // console.log("CurrentUser Updated: ", currentUser);
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
            className='border-2 text-white bg-zinc-700 border-zinc-500 px-4 py-2 rounded-md hover:bg-white hover:text-black transition-all duration-300 w-[5vw] dark:bg-green-800 dark:border-green-800 dark:hover:bg-white'
        >
            Sign In
        </button>
    );
}

export default SignInButton;