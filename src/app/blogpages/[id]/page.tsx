import BlogPageLayout from "@/components/features/BlogPageLayout";
import prisma from "../../../../lib/prisma";

interface Params {
    id: string;
}

export default async function BlogPage({ params }: { params: Params }) {
    let posts = [];
    let users = [];

    posts = await prisma.post.findMany({
        where: {
            id: {
                in: [params.id]
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
    })

    users = await prisma.user.findMany({
        where: {
            posts: {
                some: {
                    id: {
                        in: [params.id]
                    }
                }
            }
        },
        include: {
            following: {
                select: {
                    followingId: true,
                }
            }
        },
    })

    return (
        <div >
            <BlogPageLayout postsProps={posts} usersProps={users}/>
        </div>
    );
}