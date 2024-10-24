import { BellIcon, CircleProfileIcon, SearchIcon } from "@/components/elements/icon/Icons";
import Input from "@/components/elements/input/Input";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Header() {
    return (
        <div className="relative bg-white text-gray-700 shadow-md p-4 flex items-center justify-end h-20">
            <div className="absolute left-1/2 -translate-x-1/2">
                <Link href="#">
                    <span className="text-3xl font-bold">Test</span>
                </Link>
            </div>
            <div className="relative flex items-center pt-3 gap-2">
                <Input placeholder=" serch..." className="pl-2 pr-6 bg-slate-100 " />
                <SearchIcon className="absolute custom-right-68 h-4 w-4 text-gray-700" />
                <Link href="#">
                    <BellIcon className="h-5 w-5 text-gray-700" />
                </Link>
                <div className="flex items-center">
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                    <SignedOut>
                        <Link href="/sign-up">
                            <CircleProfileIcon className="h-7 w-7 text-gray-700"/>
                        </Link>
                    </SignedOut>
                </div>
            </div>
        </div>
    )
}