"use client"

import { HeartIcon } from "@/components/elements/Icons";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchUserId, followAction } from "../../../lib/actions";
import Button from "../elements/Button";
import { ProfileLayoutProps } from "@/interface/interface";
import StatItem from "./StatItem";

export default function ProfileLayout({ data }: ProfileLayoutProps) {
    const [userId, setUserId] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            const userId = await fetchUserId();
            setUserId(userId)
        };
        fetchData();
    }, [])

    const uniqueData = data[0]
    const likedUserDataArray = uniqueData.posts.map(post => post.likes.map(user => user.userId));
    const followersUserDataArray = uniqueData.following.map(user => user.followerId);
    const followingUserDataArray = uniqueData.followers.map(user => user.followingId);

    const followingCount = followingUserDataArray.flat(Infinity).length
    const followersCount = followersUserDataArray.flat(Infinity).length
    const likesCount = likedUserDataArray.flat(Infinity).length

    if (!uniqueData.image) {
        throw new Error("image not found");
    }

    const handleFollowAction = () => {
        followAction(uniqueData);
    }

    return (
        <div className="absolute w-[95%] md:w-[70%] lg:w-3/5 h-[calc(100vh-80px)] left-1/2 -translate-x-1/2 p-6">
            <div className="h-aute bg-white flex flex-col justify-center items-center p-3 text-2xl gap-4">
                <div className="pt-3 flex flex-col items-center justify-center gap-2">
                    <Image width={100} height={100} className="rounded-full" src={uniqueData.image} alt="User's profile picture" />
                    {uniqueData.username}
                    {userId ?
                        <form action={handleFollowAction}>
                            <Button className={`font-normal text-sm p-1 w-20 ${uniqueData.following.some(user => user.followerId === userId) ? "bg-slate-50 hover:bg-slate-100" : "bg-gray-700 text-white hover:bg-gray-600"}`}>
                                {uniqueData.following.some(user => user.followerId === userId) ? "following" : "follow"}
                            </Button>
                        </form>
                        :
                        <Link href="/sign-up" className="font-normal text-sm p-1 w-20 bg-gray-700 text-white hover:bg-gray-600 rounded-xl flex justify-center items-center">
                            follow
                        </Link>
                    }
                </div>
                <div className="flex justify-center items-center text-sm text-black pb-3 border-b">
                    <StatItem count={followingCount} label="Following" />
                    <StatItem count={followersCount} label="Followers" />
                    <StatItem count={likesCount} label="Likes" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-slate-50 p-4">
                    {uniqueData.posts.map((post) => {
                        return (
                            <div key={`${post.id}`} className="relative bg-white aspect-square w-28 sm:w-32 rounded-xl flex flex-col pl-4 pt-4 pr-4">
                                <Link href={`/blogpages/${post.id}`} className="h-[75%] border-b border-gray-700 text-xs sm:text-base flex justify-center items-center">
                                    <span className="overflow-hidden break-words text-center">
                                        {post.title}
                                    </span>
                                </Link>
                                <div className="h-[25%] flex justify-end items-center gap-2 pr-1 text-sm">
                                    <HeartIcon className={`h-4 w-4 pt-[2px] ${post.likes.map(like => like.userId).some(user => user == userId) ? "text-red-500" : ""}`} />
                                    {post.likes.map(like => like.userId).length}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}