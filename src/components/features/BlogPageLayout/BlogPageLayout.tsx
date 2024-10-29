import Button from "@/components/elements/button/Button";
import { HeartIcon, ShareIcon } from "@/components/elements/icon/Icons";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

interface PostData {
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

interface BlogPageLayoutProps {
    data: PostData[]
}

export default function BlogPageLayout({ data }: BlogPageLayoutProps) {
    const { userId } = auth();

    const uniqueData = data[0]

    if (!uniqueData.author.image) {
        throw new Error("image not found");
    }

    const likeAction = async () => {
        "use server"
        try {

        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="flex text-gray-700 h-[calc(100vh-80px)]">
            <div className="w-[10%] pl-6 pt-8 pb-6">
                <div className="h-full flex flex-col items-center gap-2 ">
                    <form action={likeAction}>
                        <Button className="bg-white h-12 w-12 rounded-full flex items-center justify-center"><HeartIcon className="h-8 w-8" /></Button>
                    </form>
                    <Button className="bg-white h-12 w-12 rounded-full flex items-center justify-center"><ShareIcon className="h-8 w-8" /></Button>
                </div>
            </div>
            <div className="w-[65%] pr-6 pl-3 pt-6 pb-6">
                <div className="bg-white h-auto p-4 flex flex-col">
                    <div className="relative h-12 flex items-center justify-end border-b pb-4">
                        <div className="absolute left-1/2 -translate-x-1/2 text-3xl text-center">
                            {uniqueData.title}
                        </div>
                        <div className="absolute right-0 bottom-0 pr-2">
                            <div className="flex gap-4 items-center justify-between">
                                <div className="flex items-center gap-1">
                                    <HeartIcon className="h-4 w-4 pt-[2px]" />
                                    {uniqueData.likes.map(like => like.userId).length}
                                </div>
                                {uniqueData.createdAt.toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                    <div className="pt-4 pl-2 pr-2 text-xl overflow-hidden break-words">
                        {uniqueData.content}
                    </div>
                </div>
            </div>
            <div className="w-[25%] pt-6 pr-6 pb-6">
                <div className="h-[88px] bg-white">
                    <div className="flex items-center p-4 gap-4 font-bold text-xl">
                        <Link href={`/profile/${uniqueData.author.id}`} className="flex items-center gap-4 hover:bg-slate-100 p-2 rounded-md">
                            <Image width={40} height={40} className="rounded-full" src={uniqueData.author.image} alt="User's profile picture" />
                            {uniqueData.author.username}
                        </Link>
                        {userId ? (uniqueData.author.id !== userId ? <Button className="bg-slate-50 font-normal text-lg p-1">follow</Button> : <div></div>) : <div></div>}
                    </div>
                </div>
            </div>
        </div>
    )
}
