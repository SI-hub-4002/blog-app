import { auth } from "@clerk/nextjs/server";
import prisma from "../../../../lib/prisma";
import { HeartIcon, ShareIcon } from "@/components/elements/icon/Icons";

export default async function MainContent() {
    let posts = [];

    const { userId } = auth();

    if (!userId) {
        throw new Error("user not authenticated")
    }

    posts = await prisma.post.findMany({
        where: {
            authorId: {
                in: [userId],
            }
        },
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
        <div className="absolute w-3/5 custom-t-144 left-1/2 -translate-x-1/2">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {posts.map((post) => {
                    return (
                        <div key={`${post.id}`} className="bg-white aspect-square rounded-xl flex flex-col pl-4 pt-4 pr-4">
                            <div className="h-[75%] border-b border-gray-700 text-2xl flex justify-center items-center">
                                {post.title}
                            </div>
                            <div className="h-[25%] flex justify-end items-center gap-2 pr-1">
                                <HeartIcon />
                                <ShareIcon />
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}