import { CircleProfileIcon } from "@/components/elements/Icons";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Header() {
    return (
        <div className="relative bg-white text-gray-700 shadow-md p-4 flex items-center justify-end h-20">
            <Link href="/" className="absolute left-1/2 -translate-x-1/2">
                <span className="text-3xl font-bold">Blog</span>
            </Link>
            <div className="relative flex items-center pt-3 pr-3 gap-2">
                <SignedIn>
                    <UserButton />
                </SignedIn>
                <SignedOut>
                    <Link href="/sign-up">
                        <CircleProfileIcon className="h-8 w-8 text-gray-700" />
                    </Link>
                </SignedOut>
            </div>
        </div>
    )
}