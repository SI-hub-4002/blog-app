"use client"

import { HomeIcon, ProfileIcon, SettingIcon } from "@/components/elements/icon/Icons";
import Link from "next/link";
import "../../../styles/globals.css"
import { useState } from "react";

export default function Navigation() {
    const [navState, setNavState] = useState(false);

    const navList = [
        { icon: HomeIcon, lavel: "Home", href: "#" },
        { icon: ProfileIcon, lavel: "Profile", href: "#" },
        { icon: SettingIcon, lavel: "Setting", href: "#" },
    ]

    return (
        <div>
            <button type="button" id="navBtn" onClick={() => setNavState(!navState)} className="absolute z-30 left-8 top-8 custom-h-26 custom-w-26">
                <span className={`absolute block z-30 custom-h-2 custom-w-26 left-0 rounded-lg bg-gray-500 transition-all duration-200 ease-linear ${navState ? "top-1/2 -translate-y-1/2 rotate-[-315deg]" : "custom-t-2"}`}></span>
                <span className={`absolute block z-30 custom-h-2 custom-w-26 left-0 rounded-lg bg-gray-500 transition-all duration-200 ease-linear ${navState ? "hidden" : "top-1/2 -translate-y-1/2"}`}></span>
                <span className={`absolute block z-30 custom-h-2 custom-w-26 left-0 rounded-lg bg-gray-500 transition-all duration-200 ease-linear ${navState ? "top-1/2 -translate-y-1/2 rotate-[315deg]" : "custom-b-2"}`}></span>
            </button>
            <div className={`absolute h-full w-full ${navState ? "bg-black opacity-70 z-10" : "z-0"}`}>
            </div>
            <div id="navMenu" className={`absolute z-20 h-full w-80 transition-all duration-200 ease-linear ${navState ? "" : "-translate-x-full"}`}>
                <div className="bg-white p-10 pt-20 h-full">
                    <nav className="flex-col text-gray-700">
                        <ul>
                        {navList.map(props => {
                            return (
                                <li key={props.lavel} className="flex items-center border-b pt-3 pb-3 pl-16 border-gray-500 gap-2 hover:bg-slate-100">
                                    <props.icon className="h-7 w-7" />
                                    <Link href={props.href} className="text-2xl">{props.lavel}</Link>
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