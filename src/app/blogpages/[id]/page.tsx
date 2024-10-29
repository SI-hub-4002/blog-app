import BlogPageLayout from "@/components/features/BlogPageLayout/BlogPageLayout";
import prisma from "../../../../lib/prisma";

interface Params {
    id: string; 
}

export default async function BlogPage({params}: { params: Params}) {
    let posts = [];

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

    return (
        <div >
            <BlogPageLayout data={posts}/>
        </div>
    );
}