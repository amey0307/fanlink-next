import React, { useEffect, useState } from "react";
import { useUser, useClerk, UserButton } from "@clerk/clerk-react";
import { useAuth } from "../context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { LucideUser } from "lucide-react";

function SignInButton() {
  const { openSignIn } = useClerk();
  const { isSignedIn, user } = useUser();
  const { signIn, signOut } = useAuth() as {
    signIn: (user: any) => void;
    signOut: () => void;
  };
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isSignedIn !== undefined) {
      setLoading(false);

      if (isSignedIn && user) {
        // User is signed in, update our context
        signIn(user);
      } else {
        // User is signed out, clear our context
        signOut();
      }
    }
  }, [isSignedIn, user, signIn, signOut]);

  const handleSignIn = () => {
    openSignIn({
      afterSignInUrl: "/", // Redirect here after sign-in
      afterSignUpUrl: "/", // Redirect here after sign-up
    });
  };

  if (loading) {
    return <Skeleton className="h-12 w-24" />;
  }

  if (isSignedIn) {
    return (
      <div className="scale-[1.7] mr-6 mt-2">
        <UserButton />
      </div>
    );
  }

  return (
    <button
      onClick={handleSignIn}
      className="border-[1px] text-white bg-[#081e0be6] rounded-sm hover:bg-white hover:text-black transition-all duration-300 py-[6px] px-[1.2em] dark:bg-[#081b0b78] dark:text-white dark:hover:text-black dark:hover:bg-white flex items-center justify-center gap-2 hover:scale-105 text-md cursor-pointer"
    >
      <LucideUser size={18} /> Sign In
    </button>
  );
}

export default SignInButton;
