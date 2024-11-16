import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import Link from "next/link";
import Image from "next/image";

export default async function Header() {
    const session = await getServerSession(authOptions);
    const user = session?.user;
    return (
        <div className="relative bg-white text-gray-700 shadow-md p-4 flex items-center justify-end h-20">
            <Link href="/" className="absolute left-1/2 -translate-x-1/2">
                <span className="text-3xl font-bold">N-Blog</span>
            </Link>
            <Link href={user?.id ? `/myprofile/${user?.id}` : "/signin"} className="absolute right-4 top-6">
                <Image className="rounded-full" width={40} height={40} alt="profile_icon" src={user?.image || "/images/23296822.png"}/>
            </Link>
        </div>
    )
}