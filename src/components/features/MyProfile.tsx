"use client"

import { HeartIcon, TrashIcon } from "@/components/elements/Icons";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/elements/Button";
import { deleteAction, fetchUserId } from "../../../lib/actions";
import { useEffect, useState } from "react";

interface ProfileData {
    id: string;
    image: string | null;
    createdAt: Date;
    update: Date;
    username: string;
    bio: string | null;
    likes: {
        userId: string;
    }[];
    followers: {
        followerId: string;
    }[];
    following: {
        followingId: string;
    }[];
    posts: {
        id: string;
        title: string;
        createdAt: Date;
        likes: {
            userId: string;
        }[];
    }[];
};

interface ProfileLayoutProps {
    data: ProfileData[]
}

export default function MyProfileLayout({ data }: ProfileLayoutProps) {
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
    const followersUserDataArray = uniqueData.following.map(user => user.followingId);
    const followingUserDataArray = uniqueData.followers.map(user => user.followerId);

    const [likeErr, setLikeErr] = useState<string>("")

    if (!uniqueData.image) {
        throw new Error("image not found");
    }

    const handleDeleteAction = async (postId: string) => {
        try {
            await deleteAction(postId);
            setLikeErr("");
        } catch {
            setLikeErr("posts that have been liked cannot be deleted");
        }
    }
    return (
        <div className="absolute w-[95%] md:w-[70%] lg:w-3/5 h-[calc(100vh-80px)] left-1/2 -translate-x-1/2 p-6">
            <div className="h-aute bg-white flex flex-col justify-center items-center p-3 text-2xl gap-4">
                <div className="pt-3 flex flex-col items-center justify-center gap-2">
                    <Image width={100} height={100} className="rounded-full" src={uniqueData.image} alt="User's profile picture" />
                    {uniqueData.username}
                    {likeErr ? <span className="text-sm xs:text-lg text-center text-red-500">{likeErr}</span> : <></>}
                </div>
                <div className="flex justify-center items-center text-sm text-black pb-3 border-b">
                    <div className="w-20 sm:w-24 border-r flex flex-col gap-2 justify-center items-center">
                        {followingUserDataArray.flat(Infinity).length}
                        <span className="text-gray-400">Following</span>
                    </div>
                    <div className="w-20 sm:w-24 border-r flex flex-col gap-2 justify-center items-center">
                        {followersUserDataArray.flat(Infinity).length}
                        <span className="text-gray-400">Followers</span>
                    </div>
                    <div className="w-20 sm:w-24 flex flex-col gap-2 justify-center items-center">
                        {likedUserDataArray.flat(Infinity).length}
                        <span className="text-gray-400">Likes</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-slate-50 p-4">
                    {uniqueData.posts.map((post) => {
                        return (
                            <div key={`${post.id}`} className="relative bg-white aspect-square w-28 sm:w-32 rounded-xl flex flex-col pl-4 pt-4 pr-4">
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleDeleteAction(post.id);
                                    }}
                                    className="absolute top-2 right-2"
                                >
                                    <Button className="h-5 w-5 sm:h-6 sm:w-6 hover:bg-white">
                                        <TrashIcon className="hover:text-red-500" />
                                    </Button>
                                </form>
                                <Link href={`/blogpages/${post.id}`} className="h-[75%] border-b border-gray-700 text-xs sm:text-base flex justify-center items-center">
                                <span className="overflow-hidden break-words text-center">
                                        {post.title}
                                    </span>
                                </Link>
                                <div className="h-[25%] flex justify-end items-center gap-2 pr-1 text-sm">
                                    {post.likes.map(like => like.userId).some(user => user == userId) ? <HeartIcon className="h-4 w-4 pt-[2px] text-red-500" /> : <HeartIcon className="h-4 w-4 pt-[2px]" />}
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