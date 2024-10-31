"use client"

import { HomeIcon, PostIcon, ProfileIcon } from "@/components/elements/Icons";
import Link from "next/link";
import "../../styles/globals.css"
import { useEffect, useState } from "react";
import { fetchUserId } from "../../../lib/actions";

export default function Navigation() {
    const [isOpen, setIsOpen] = useState(false);
    const [userId, setUserId] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            const userId = await fetchUserId();
            setUserId(userId)
        };
        fetchData();
    }, [isOpen])

    const navList = [
        { icon: HomeIcon, lavel: "Home", href: "/" },
        { icon: ProfileIcon, lavel: "Profile", href: userId ? `/myprofile/${userId}` : "/sign-in" },
        { icon: PostIcon, lavel: "Post", href: userId ? "/Post" : "/sign-in" },
    ]

    return (
        <div>
            <button type="button" id="navBtn" onClick={() => setIsOpen(!isOpen)} className={`z-30 left-8 top-8 custom-h-26 custom-w-26 ${isOpen ? "fixed" : "absolute"}`}>
                <span className={`absolute block z-30 custom-h-2 custom-w-26 left-0 rounded-lg bg-gray-700 transition-all duration-200 ease-linear ${isOpen ? "top-1/2 -translate-y-1/2 rotate-[-315deg]" : "custom-t-2"}`}></span>
                <span className={`absolute block z-30 custom-h-2 custom-w-26 left-0 rounded-lg bg-gray-700 transition-all duration-200 ease-linear ${isOpen ? "hidden" : "top-1/2 -translate-y-1/2"}`}></span>
                <span className={`absolute block z-30 custom-h-2 custom-w-26 left-0 rounded-lg bg-gray-700 transition-all duration-200 ease-linear ${isOpen ? "top-1/2 -translate-y-1/2 rotate-[315deg]" : "custom-b-2"}`}></span>
            </button>
            <div onClick={() => setIsOpen(!isOpen)} className={`fixed ${isOpen ? "bg-black opacity-70 z-10 h-full w-full" : "z-0"}`}>
            </div>
            <div id="navMenu" className={`fixed z-20 h-full w-80 transition-all duration-200 ease-linear ${isOpen ? "" : "-translate-x-full"}`}>
                <div className="bg-white p-10 pt-20 h-full">
                    <nav className="flex-col text-gray-700">
                        <ul>
                            {navList.map(props => {
                                return (
                                    <li key={props.lavel} className="flex items-center border-b pt-3 pb-3 pl-16 border-gray-500 hover:bg-slate-100">
                                        <Link href={props.href} onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 text-2xl"><props.icon className="h-7 w-7" />{props.lavel}</Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    )
}