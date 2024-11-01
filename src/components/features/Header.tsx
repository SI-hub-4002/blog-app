import { CircleProfileIcon } from "@/components/elements/Icons";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Header() {
    return (
        <div className="relative bg-white text-gray-700 shadow-md p-4 flex items-center justify-end h-20">
            <div className="absolute left-1/2 -translate-x-1/2">
                <Link href="/">
                    <span className="text-3xl font-bold">Blog</span>
                </Link>
            </div>
            <div className="relative flex items-center pt-3 gap-2">
                <div className="flex items-center ">
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                    <SignedOut>
                        <Link href="/sign-in">
                            <CircleProfileIcon className="h-8 w-8 text-gray-700" />
                        </Link>
                    </SignedOut>
                </div>
            </div>
        </div>
    )
}