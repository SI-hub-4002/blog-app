"use client"

import Button from "@/components/elements/Button";
import { HeartIcon } from "@/components/elements/Icons";
import Image from "next/image";
import Link from "next/link";
import { BlogPageLayoutProps } from "@/interface/interface";
import { blogPageFollowAction, fetchUserId, likeAction } from "../../../lib/actions";
import { useEffect, useState } from "react";

export default function BlogPageLayout({ postsProps, usersProps }: BlogPageLayoutProps) {
    const [userId, setUserId] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            const userId = await fetchUserId();
            setUserId(userId ?? null)
        };
        fetchData();
    }, [])

    const uniquePostData = postsProps?.[0];
    const uniqueUserData = usersProps?.[0];

    if (!uniquePostData || !uniqueUserData) {
        return <span className="flex h-[calc(100vh-80px)] justify-center items-center">Blogpage not found</span>
    }

    if (!uniquePostData.author.image) {
        throw new Error("image not found");
    }

    const likedUserArray = uniquePostData.likes.map(like => like.userId)

    const handleLikeAction = () => {
        likeAction(uniquePostData, userId);
    }

    const handleBlogPageFollowAction = () => {
        blogPageFollowAction(uniquePostData, userId);
    }

    return (
        <div className="flex text-gray-700 h-[calc(100vh-80px)]">
            <div className="flex gap-4 sm:gap-6 p-4 sm:p-6 w-full lg:w-[75%]">
                {userId ?
                    <form action={handleLikeAction} className="pt-3 sm:pt-2">
                        <Button className="bg-white hover:bg-slate-100 h-10 w-10 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center">
                            <HeartIcon className={`h-6 w-6 sm:h-8 sm:w-8 ${likedUserArray?.some(likeUserId => likeUserId === userId) ? "text-red-500" : ""}`} />
                        </Button>
                    </form>
                    :
                    <div className="pt-3 sm:pt-2">
                        <Link href="/signin" className="bg-white h-10 w-10 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center hover:bg-slate-100">
                            <HeartIcon className="h-6 w-6 sm:h-8 sm:w-8" />
                        </Link>
                    </div>
                }
                <div className="bg-white w-full h-auto p-4 flex flex-col">
                    <div className="relative h-12 flex items-center border-b pb-4 pl-2">
                        <div className="text-xl sm:text-2xl text-left overflow-hidden break-words">
                            {uniquePostData.title}
                        </div>
                        <div className="absolute right-0 bottom-0 pr-2 hidden md:block">
                            <Link
                                className="flex items-center gap-2 lg:hidden overflow-hidden break-words hover:bg-slate-100 p-1 rounded-md"
                                href={(uniquePostData.author.id !== userId ?
                                    `/profile/${uniquePostData.author.id}`
                                    :
                                    `/myprofile/${uniquePostData.author.id}`)}
                            >
                                <Image width={20} height={20} className="rounded-full" src={uniquePostData.author.image} alt="User's profile picture" />
                                {uniquePostData.author.name}
                            </Link>
                            <div className="flex gap-4 items-center justify-between">
                                <div className="flex items-center gap-1">
                                    <HeartIcon className={`h-4 w-4 pt-[2px] ${likedUserArray?.some(likeUserId => likeUserId === userId) ? "text-red-500" : ""}`} />
                                    {uniquePostData.likes.map(like => like.userId).length}
                                </div>
                                {uniquePostData.createdAt.toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-start pt-1 gap-3 md:hidden text-sm">
                        <Link
                            className="flex items-center gap-2 lg:hidden overflow-hidden break-words hover:bg-slate-100 p-1 rounded-md"
                            href={(uniquePostData.author.id !== userId ?
                                `/profile/${uniquePostData.author.id}`
                                :
                                `/myprofile/${uniquePostData.author.id}`)}
                        >
                            <Image width={20} height={20} className="rounded-full" src={uniquePostData.author.image} alt="User's profile picture" />
                            {uniquePostData.author.name}
                        </Link>
                        <div className="flex items-center gap-[2px]">
                            <HeartIcon className={`h-4 w-4 pt-[2px] ${likedUserArray.some(likeUserId => likeUserId === userId) ? "text-red-500" : ""}`} />
                            {uniquePostData.likes.map(like => like.userId).length}
                        </div>
                        {uniquePostData.createdAt.toLocaleDateString()}
                    </div>
                    <div className="pt-4 pl-2 pr-2 text-base sm:text-xl break-words">
                        {uniquePostData.content}
                    </div>
                </div>
            </div>
            <div className="w-[25%] hidden lg:block pt-6 pr-6 pb-6">
                <div className="flex items-center p-4 gap-2 font-bold text-xl bg-white">
                    <Link
                        className="flex items-center gap-4 overflow-hidden break-words hover:bg-slate-100 p-2 rounded-md"
                        href={(uniquePostData.author.id !== userId
                            ? `/profile/${uniquePostData.author.id}`
                            : `/myprofile/${uniquePostData.author.id}`)}
                    >
                        <Image
                            width={40}
                            height={40}
                            className="rounded-full"
                            src={uniquePostData.author.image}
                            alt="User's profile picture"
                        />
                        {uniquePostData.author.name}
                    </Link>
                    {userId && userId !== uniquePostData.authorId &&
                        <form action={handleBlogPageFollowAction}>
                            <Button className={`font-normal text-sm p-1 w-20 ${uniqueUserData.following.some(uniqueUser => uniqueUser.followerId === userId) ? "bg-slate-50 hover:bg-slate-100" : "bg-gray-700 text-white hover:bg-gray-600"}`}>
                                {uniqueUserData.following.some(uniqueUser => uniqueUser.followerId === userId) ? "following" : "follow"}
                            </Button>
                        </form>
                    }
                </div>
            </div>
        </div>
    )
}
