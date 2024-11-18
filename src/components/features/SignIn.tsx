"use client"

import Button from "@/components/elements/Button";
import { getProviders, signIn } from "next-auth/react"
import { useEffect, useState } from "react";
import Link from "next/link";

export default function SignIn() {
    const [providers, setProviders] = useState<object | null>(null);

    useEffect(() => {
        const fetchProviders = async () => {
            const res = await getProviders();
            setProviders(res);
        };
        fetchProviders();
    }, []);
    console.log(providers)

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
                        if (provider.id === 'email') {
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
                <div className="border-t">
                    <span className="text-gray-400 text-sm">
                        Don’t have an account? {<Link href="/signup" className="text-gray-600 font-bold hover:text-gray-400">Sign up</Link>}
                    </span>
                </div>
            </div>
        </div>
    )
}