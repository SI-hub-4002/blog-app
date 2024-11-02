"use server";

import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import prisma from "./prisma";
import { revalidatePath } from "next/cache";

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
      followingId: string;
  }[];
  following: {
      followerId: string;
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

export async function postAction(formData: FormData) {
  try {
    const postTitle = formData.get("postTitle") as string;
    const postTitleSchema = z
      .string()
      .min(1, "please enter a title")
      .max(30, "please enter a title within the 30 word limit");
    const validatedPostTitle = postTitleSchema.parse(postTitle);

    const postContent = formData.get("postContent") as string;
    const postContentSchema = z
      .string()
      .min(1, "please enter a text")
      .max(2000, "please enter a text within the 2000 word limit");
    const validatedPostContent = postContentSchema.parse(postContent);

    const { userId } = auth();
    if (!userId) {
      throw new Error("user not authenticated");
    }

    await prisma.post.create({
      data: {
        title: validatedPostTitle,
        content: validatedPostContent,
        authorId: userId,
      },
    });

    return {
      message: "post creation successful",
      success: true,
    };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return {
        error: err.errors.map((e) => e.message).join(", "),
        success: false,
      };
    } else if (err instanceof Error) {
      return {
        error: err.message,
        success: false,
      };
    } else {
      return {
        error: "an unexpected error has occurred",
        success: false,
      };
    }
  }
}

export async function fetchUserId() {
  const {userId} = auth();
  return userId;
}

export async function AllContents() {
  let posts = [];
  posts = await prisma.post.findMany({
    include: {
      author: true,
      likes: {
        select: {
          userId: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return posts;
}

export async function LikesContents() {
  const { userId } = auth();

  let posts = [];
  posts = await prisma.post.findMany({
    where: {
      likes: {
        some: {
          AND: [...(userId ? [{ userId }] : [])],
        },
      },
    },
    include: {
      author: true,
      likes: {
        select: {
          userId: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return posts;
}

export async function FollowingContents() {
  const {userId} = auth();
  if(!userId) {
    return;
  }

  const users = await prisma.user.findMany({
    where: {
      following: {
        some: {
          followerId: userId,
        }
      }
    },
    include: {
      posts: {
        select: {
          id: true,
          title: true,
          authorId: true,
          createdAt: true,
          likes: {
            select: {
              userId: true,
            }
          }
        }
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  console.log(users)

  const posts = users.flatMap(user => {
    return (user.posts.map(post => {
      return ({
      id: post.id,
      createdAt: post.createdAt,
      title: post.title,
      authorId: post.authorId,
      author: {
        id: user.id,
        createdAt: user.createdAt,
        image: user.image,
        update: user.update,
        username: user.username,
        bio: user.bio
      },
      likes: post.likes.map(like => ({
        userId: like.userId
      })),
    })}))
  })
  return posts;
}

export async function deleteAction(postId: string) {
  const userId = fetchUserId();
  await prisma.post.delete({
    where: {
      id: postId,
    },
  });
  revalidatePath(`/myprofile/${userId}`);
}

export async function followAction(uniqueData: ProfileData) {
  const {userId} = auth();
  try {
      const existingFollowerField = await prisma.follower.findFirst({
          where: {
              AND: [
                  { followingId: uniqueData.id },
                  ...(userId ? [{ followerId: userId }] : []),
              ]
          },
      });
      console.log("called")
      if (existingFollowerField) {
          await prisma.follower.delete({
              where: {
                  id: existingFollowerField.id,
              }
          })
          revalidatePath(`/profile/${uniqueData.id}`);
      } else {
          if (userId) {
              await prisma.follower.create({
                  data: {
                      followerId: userId,
                      followingId: uniqueData.id,
                  }
              });
              revalidatePath(`/profile/${uniqueData.id}`);
          } else {
              console.log("user is not authenticated")
          }
      }
  } catch (err) {
      console.log(err);
  }
};
