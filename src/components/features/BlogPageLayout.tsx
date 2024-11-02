import Button from "@/components/elements/Button";
import { HeartIcon } from "@/components/elements/Icons";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import prisma from "../../../lib/prisma";
import { revalidatePath } from "next/cache";

interface PostsProps {
    id: string;
    title: string;
    content: string;
    authorId: string;
    createdAt: Date;
    update: Date;
    author: {
        id: string;
        createdAt: Date;
        update: Date;
        image: string | null;
        username: string;
        bio: string | null;
    };
    likes: {
        userId: string;
    }[];
};

interface UsersProps {
    id: string;
    createdAt: Date;
    image: string | null;
    update: Date;
    username: string;
    bio: string | null;
    following: {
        followerId: string;
    }[];
};

interface BlogPageLayoutProps {
    postsProps: PostsProps[];
    usersProps: UsersProps[];
};

export default function BlogPageLayout({ postsProps, usersProps }: BlogPageLayoutProps) {
    const { userId } = auth();

    const uniquePostData = postsProps[0];
    const uniqueUserData = usersProps[0];

    if (!uniquePostData.author.image) {
        throw new Error("image not found");
    }

    const likedUserArray = uniquePostData.likes.map(like => like.userId);

    const likeAction = async () => {
        "use server"

        try {
            const existingLikeField = await prisma.like.findFirst({
                where: {
                    AND: [
                        { postId: uniquePostData.id },
                        ...(userId ? [{ userId }] : []),
                    ]
                },
            });

            if (existingLikeField) {
                await prisma.like.delete({
                    where: {
                        id: existingLikeField.id,
                    }
                })
                revalidatePath(`/blogpages/${uniquePostData.id}`);
            } else {
                if (userId) {
                    await prisma.like.create({
                        data: {
                            userId: userId,
                            postId: uniquePostData.id,
                        }
                    });
                    revalidatePath(`/blogpages/${uniquePostData.id}`);
                } else {
                    console.log("user is not authenticated")
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    const followAction = async () => {
        "use server"

        try {
            const existingFollowerField = await prisma.follower.findFirst({
                where: {
                    AND: [
                        { followingId: uniquePostData.authorId },
                        ...(userId ? [{ followerId: userId }] : []),
                    ]
                },
            });

            if (existingFollowerField) {
                await prisma.follower.delete({
                    where: {
                        id: existingFollowerField.id,
                    }
                })
                revalidatePath(`/blogpages/${uniquePostData.id}`);
            } else {
                if (userId) {
                    await prisma.follower.create({
                        data: {
                            followerId: userId,
                            followingId: uniquePostData.authorId,
                        }
                    });
                    revalidatePath(`/blogpages/${uniquePostData.id}`);
                } else {
                    console.log("user is not authenticated")
                }
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="flex text-gray-700 h-[calc(100vh-80px)]">
            <div className="w-[15%] md:w-[10%] pl-6 pt-8 pb-6">
                <div className="h-full flex flex-col items-center gap-2 ">
                    <form action={likeAction}>
                        <Button className="bg-white h-10 w-10 sm:h-12 sm:w-12 rounded-full flex items-center justify-center">
                            {likedUserArray.some(user => user == userId) ? <HeartIcon className="h-8 w-8 text-red-500" /> : <HeartIcon className="h-8 w-8" />}
                        </Button>
                    </form>
                    {/* <Button className="bg-white h-10 w-10 sm:h-12 sm:w-12 rounded-full flex items-center justify-center">
                        <ShareIcon className="h-8 w-8" />
                    </Button> */}
                </div>
            </div>
            <div className="w-[85%] md:w-[90%] lg:w-[65%] pr-6 pl-3 pt-6 pb-6">
                <div className="bg-white h-auto p-4 flex flex-col">
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
                                {uniquePostData.author.username}
                            </Link>
                            <div className="flex gap-4 items-center justify-between">
                                <div className="flex items-center gap-1">
                                    {likedUserArray.some(user => user == userId) ? <HeartIcon className="h-4 w-4 pt-[2px] text-red-500" /> : <HeartIcon className="h-4 w-4 pt-[2px]" />}
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
                            {uniquePostData.author.username}
                        </Link>
                        <div className="flex items-center gap-[2px]">
                            {likedUserArray.some(user => user == userId) ? <HeartIcon className="h-4 w-4 pt-[2px] text-red-500" /> : <HeartIcon className="h-4 w-4 pt-[2px]" />}
                            {uniquePostData.likes.map(like => like.userId).length}
                        </div>
                        {uniquePostData.createdAt.toLocaleDateString()}
                    </div>
                    <div className="pt-4 pl-2 pr-2 text-base sm:text-xl overflow-hidden break-words">
                        {uniquePostData.content}
                    </div>
                </div>
            </div>
            <div className="w-[25%] hidden lg:block pt-6 pr-6 pb-6">
                <div className="h-[88px] bg-white">
                    <div className="flex items-center p-4 gap-2 font-bold text-xl">
                        <Link
                            className="flex items-center gap-4 overflow-hidden break-words hover:bg-slate-100 p-2 rounded-md"
                            href={(uniquePostData.author.id !== userId ?
                                `/profile/${uniquePostData.author.id}`
                                :
                                `/myprofile/${uniquePostData.author.id}`)}
                        >
                            <Image width={40} height={40} className="rounded-full" src={uniquePostData.author.image} alt="User's profile picture" />
                            {uniquePostData.author.username}
                        </Link>
                        {userId && uniquePostData.author.id !== userId && (
                            <form action={followAction}>
                                {uniqueUserData.following.some(user => user.followerId === userId) ? <Button className="bg-slate-50 font-normal text-sm p-1 w-20">following</Button> : <Button className="bg-gray-700 text-white hover:bg-gray-600 font-normal text-sm p-1 w-20">follow</Button>}
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
