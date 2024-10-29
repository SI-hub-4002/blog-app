import prisma from "../../../../lib/prisma";
import { HeartIcon } from "@/components/elements/icon/Icons";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/elements/button/Button";

export default async function MainContent() {
    let posts = [];

    posts = await prisma.post.findMany({
        include: {
            author: true,
            likes: {
                select: {
                    userId: true,
                }
            }
        },
        orderBy: {
            createdAt: "desc",
        }
    })

    return (
        <div>
            <div className="absolute z-1 left-1/2 -translate-x-1/2 flex items-center h-16">
                <div className="shadow-md rounded-3xl bg-white">
                    <Button className="h-10 w-24 text-lg">All</Button>
                    <Button className="h-10 w-24 text-lg">Following</Button>
                    <Button className="h-10 w-24 text-lg">Likes</Button>
                </div>
            </div>
            <div className="absolute w-3/5 custom-t-144 left-1/2 -translate-x-1/2">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {posts.map((post) => {
                        return (
                            <div key={`${post.id}`} className="bg-white aspect-square rounded-xl flex flex-col pl-4 pt-4 pr-4">
                                <Link href={`blogpages/${post.id}`} className="h-[75%] border-b border-gray-700 text-2xl flex justify-center items-center">
                                    {post.title}
                                </Link>
                                <div className="h-[25%] flex items-center p-1 pl-2 gap-4 text-sm overflow-hidden break-words">
                                    <Link href={`/profile/${post.author.id}`} className="flex items-center gap-2 overflow-hidden break-words">
                                        <Image width={25} height={25} className="rounded-full" src={post.author.image ? post.author.image : ""} alt="User's profile picture" />
                                        {post.author.username}
                                    </Link>
                                    <div className="flex items-center gap-1">
                                        <HeartIcon className="w-4 h-4 pt-[2px]" />
                                        {post.likes.map(like => like.userId).length}
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