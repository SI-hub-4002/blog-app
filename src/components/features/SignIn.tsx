"use client"

import Button from "@/components/elements/Button";
import { getProviders, signIn, useSession } from "next-auth/react"
import { useEffect, useState } from "react";
import Input from "../elements/Input";
import Link from "next/link";

export default function SignIn() {
    const [providers, setProviders] = useState<object | null>(null);
    const [email, setEmail] = useState("");
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { data: session, status } = useSession();
    console.log(session)

    useEffect(() => {
        const fetchProviders = async () => {
            const res = await getProviders();
            setProviders(res);
        };
        fetchProviders();
    }, []);

    if (status === "loading") {
        return <div>Loading...</div>;  
    }

    if (session) {
        return (
            <div className="text-center">
                <p>You are already signed in. Redirecting...</p>
                <Link href="/">Go to homepage</Link>
            </div>
        );
    }

    const handleEmailSignIn = async () => {
        if (email) {
            setError(null);
            try {
                const result = await signIn("email", { email, callbackUrl: "/" });

                if (result?.error) {
                    setError("Failed to send email. Please try again.");
                } else {
                    setIsEmailSent(true); 
                }
            } catch {
                setError("An error occurred while signing in.");
            }
        } else {
            setError("Please enter a valid email address.");
        }
    };

    return (
        <div className="absolute w-[380px] sm:w-[420px] h-[calc(100vh-80px)] left-1/2 -translate-x-1/2 p-6 pt-10 sm:pt-16 text-gray-700">
            <div className="bg-white shadow-lg flex flex-col p-4 items-center text-2xl gap-2">
                <div className="flex flex-col justify-center items-center">
                    <span className="font-bold text-3xl pb-2">N-Blog</span>
                    <span className="font-bold text-xl">Sign in to N-Blog</span>
                    <span className="text-sm text-gray-400">Welcome back! Please sign in to continue</span>
                </div>
                {providers &&
                    Object.values(providers).map((provider) => {
                        if (provider.id === 'github') {
                            return (
                                <div key={provider.id} className="pb-2">
                                    <Button
                                        className="bg-white hover:bg-slate-50 shadow-sm text-sm p-1 border border-gray-300 rounded-md w-60"
                                        onClick={() => signIn(provider.id, { callbackUrl: "/" })}
                                    >
                                        Sign in with <span className="font-extrabold">{provider.name}</span>
                                    </Button>
                                </div>
                            );
                        }
                        return null;
                    })
                }
                <div className="flex flex-col gap-7 border-t pt-5 pb-5">
                    <div className="flex flex-col gap-0">
                        <span className="font-bold text-sm pb-2">Email address</span>
                        <Input
                            className="border text-base border-gray-300 focus:outline-none p-1 pl-2 pr-2 w-72"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                        />
                    </div>
                    <Button className="p-1 text-sm text-white bg-gray-700 hover:bg-gray-600" onClick={handleEmailSignIn}>
                        {isEmailSent ? "Check your inbox" : "Continue"}
                    </Button>
                    {isEmailSent && (
                        <div className="text-sm text-gray-500 mt-3">
                            Please check your inbox for the sign-in link.
                        </div>
                    )}
                    {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
                </div>
                <div className="border-t">
                    <span className="text-gray-400 text-sm">
                        Already have an account? {<Link href="/signup" className="text-gray-600 font-bold hover:text-gray-400">Sign up</Link>}
                    </span>
                </div>
            </div>
        </div>
    )
}