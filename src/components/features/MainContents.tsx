"use client"

import { HeartIcon } from "@/components/elements/Icons";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/elements/Button";
import { useEffect, useState } from "react";
import { AllContents, fetchUserId, FollowingContents, LikesContents } from "../../../lib/actions";
import { PostsPropsArray } from "@/interface/interface";

export default function MainContent() {
    const [btnState, setBtnState] = useState<string>("all");
    const [posts, setPosts] = useState<PostsPropsArray>([]);
    const [userId, setUserId] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            const userId = await fetchUserId();
            setUserId(userId ?? null)
        };
        fetchData();
    }, [])

    useEffect(() => {
        const sortAction = async () => {
            let posts;
            if (btnState == "all") {
                posts = await AllContents();
                setPosts(posts);
            } else if (btnState == "following") {
                posts = await FollowingContents();
                if (!posts) {
                    return [];
                }
                setPosts(posts);
            } else {
                posts = await LikesContents();
                setPosts(posts);
            }
        };
        sortAction();
    }, [btnState]);

    return (
        <div className={`flex flex-col items-center ${userId ? "" : "pt-4"}`}>
            <div className={`w-4/5 md:w-[70%] lg:w-3/5 flex items-center justify-center h-16 ${userId ? "" : "hidden"}`}>
                <div className="shadow-md rounded-3xl bg-white">
                    <Button type="button" onClick={() => { setBtnState("all") }} className={`h-8 w-20 text-sm sm:h-10 sm:w-24 sm:text-lg ${btnState === "all" ? "bg-slate-100" : ""}`}>All</Button>
                    <Button type="button" onClick={() => { setBtnState("following") }} className={`h-8 w-20 text-sm sm:h-10 sm:w-24 sm:text-lg ${btnState === "following" ? "bg-slate-100" : ""}`}>Following</Button>
                    <Button type="button" onClick={() => { setBtnState("likes") }} className={`h-8 w-20 sm:h-10 text-sm sm:w-24 sm:text-lg ${btnState === "likes" ? "bg-slate-100" : ""}`}>Likes</Button>
                </div>
            </div>
            <div className="w-4/5 md:w-[70%] lg:w-3/5">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {posts.map((post) => {
                        return (
                            <div key={`${post.id}`} className="bg-white aspect-square rounded-xl flex flex-col pl-4 pt-4 pr-4 shadow-md">
                                <Link href={`blogpages/${post.id}`} className="h-[75%] border-b border-gray-700 text-base sm:text-xl md:text-2xl flex justify-center items-center">
                                    <span className="overflow-hidden break-words">
                                        {post.title}
                                    </span>
                                </Link>
                                <div className="h-[25%] flex items-center p-1 sm:pl-2 gap-2 sm:gap-4 text-xs sm:text-sm overflow-hidden">
                                    <Link href={`/${post.author.id === userId ? "myprofile" : "profile"}/${post.author.id}`} className="flex items-center gap-2 overflow-hidden">
                                        <Image width={25} height={25} className="rounded-full" src={post.author.image ? post.author.image : ""} alt="User's profile picture" />
                                        <span className="whitespace-nowrap">
                                            {post.author.name}
                                        </span>
                                    </Link>
                                    <div className="flex items-center justify-center gap-[3px]">
                                        <HeartIcon className={`h-3 w-3 sm:h-4 sm:w-4 ${post.likes.map(like => like.userId).some(user => user == userId) ? "text-red-500" : ""}`} />
                                        <span className="text-sm sm:text-base">{post.likes.map(like => like.userId).length}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}