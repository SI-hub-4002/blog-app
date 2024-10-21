import { BellIcon, SearchIcon } from "@/components/elements/icon/Icons";
import Input from "@/components/elements/input/Input";
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
                <Input placeholder=" serch..." className="pl-2 pr-6 bg-slate-100 rounded-lg"/>
                <SearchIcon className="absolute right-8 h-4 w-4" />
                <Link href="#">
                    <BellIcon className="h-5 w-5" />
                </Link>
            </div>
        </div>
    )
}