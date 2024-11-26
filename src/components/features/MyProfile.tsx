"use client"

import { HeartIcon, PencilIcon, TrashIcon } from "@/components/elements/Icons";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/elements/Button";
import { fetchUserId, postDeleteAction, updateUsernameAction, userDeleteAction } from "../../../lib/actions";
import { useEffect, useState } from "react";
import { ProfileLayoutProps } from "@/interface/interface";
import { signOut } from "next-auth/react";
import Input from "../elements/Input";

export default function MyProfileLayout({ data }: ProfileLayoutProps) {
    const uniqueData = data[0]
    const likedUserDataArray = uniqueData.posts.map(post => post.likes.map(user => user.userId));
    const postIdArray = uniqueData.posts.map(post => post.id);
    const followersUserDataArray = uniqueData.following.map(user => user.followerId);
    const followingUserDataArray = uniqueData.followers.map(user => user.followingId);

    const [userId, setUserId] = useState<string>("");
    const [err, setErr] = useState<string>("");
    const [isEditting, setIsEditting] = useState<boolean>(false);
    const [username, setUsername] = useState<string | null>(uniqueData.name);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            const userId = await fetchUserId();
            if (!userId) {
                return;
            }
            setUserId(userId)
        };
        fetchData();
    }, [])

    if (!uniqueData.image) {
        throw new Error("image not found");
    };

    const handlePostDeleteAction = async (postId: string) => {
        setErr("");
        try {
            await postDeleteAction(postId);
        } catch {
            setErr("posts that have been liked cannot be deleted");
        }
    };

    const handleUserDeleteAction = async () => {
        setErr("");
        try {
            await userDeleteAction();
            window.location.href = '/';
        } catch {
            setErr("acount could not be deleted");
        }
    };

    const handleInputChenge = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    }

    const handleUpdateUsernameAction = async (formData: FormData) => {
        const result = await updateUsernameAction(userId, formData);
        if (!result.success) {
            setErr(result.error);
        } else {
            setErr("");
            window.location.href = `/myprofile/${userId}`;
        }
    }

    const openModal = async () => {
        setIsModalOpen(true);
    }

    const closeModal = () => {
        setIsModalOpen(false);
    }

    return (
        <div className="absolute w-[95%] md:w-[70%] lg:w-3/5 h-[calc(100vh-80px)] left-1/2 -translate-x-1/2 p-6">
            <div className="h-aute bg-white flex flex-col justify-center items-center p-3 text-2xl gap-4">
                <div className="pt-3 flex flex-col items-center justify-center gap-2">
                    <Image width={100} height={100} className="rounded-full" src={uniqueData.image} alt="User's profile picture" />
                    <form action={handleUpdateUsernameAction} className="flex jusify-center items-center gap-2 pl-5 text-gray-700">
                        {isEditting ? <Input name="username" className="w-32 h-7 border border-gray-700 p-1 text-lg" value={username ?? ""} onChange={handleInputChenge} /> : uniqueData.name}
                        {isEditting ?
                            <Button type="submit" className="text-xs bg-gray-700 hover:bg-gray-600 text-white p-1 rounded-lg">Edit</Button>
                            :
                            <PencilIcon className="w-5 h-5 text-gray-500 cursor-pointer" onClick={() => setIsEditting(!isEditting)} />
                        }
                    </form>
                    <div className="flex items-center jusitfy-center gap-2">
                        <Button className="bg-gray-700 hover:bg-gray-600 text-white text-base p-1 w-16" onClick={() => signOut({ callbackUrl: "/" })}>Logout</Button>
                        <Button onClick={openModal} className="bg-red-500 hover:bg-red-400 text-white text-base p-1 w-16">Delete</Button>
                    </div>
                    {err ? <span className="text-sm xs:text-lg text-center text-red-500">{err}</span> : <></>}
                </div>
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-lg">
                            <h3 className="text-xl font-bold mb-4">本当に削除しますか？</h3>
                            <p>アカウントを削除すると復元できません。</p>
                            <div className="mt-4 flex justify-between">
                                <Button onClick={closeModal} className="bg-gray-500 text-white">キャンセル</Button>
                                <form onSubmit={handleUserDeleteAction}>
                                    <Button className="bg-red-700 text-white">削除</Button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
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
                <div className={`grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 ${postIdArray.length === 0 ? "bg-white" : "bg-slate-50"}`}>
                    {uniqueData.posts.map((post) => {
                        return (
                            <div key={`${post.id}`} className="relative bg-white aspect-square w-28 sm:w-32 rounded-xl flex flex-col pl-4 pt-4 pr-4">
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handlePostDeleteAction(post.id);
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