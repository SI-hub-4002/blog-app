"use server";

import { z } from "zod";
import prisma from "./prisma";
import { revalidatePath } from "next/cache";
import {
  FollowDataArray,
  PostsProps,
  ProfileData,
} from "@/interface/interface";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

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

    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user?.id) {
      throw new Error("user not authenticated");
    }

    await prisma.post.create({
      data: {
        title: validatedPostTitle,
        content: validatedPostContent,
        authorId: user.id,
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
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;
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
  const session = await getServerSession(authOptions);
  const user = session?.user;

  let posts = [];
  posts = await prisma.post.findMany({
    where: {
      likes: {
        some: {
          userId: user?.id,
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
  const session = await getServerSession(authOptions);
  const user = session?.user;

  const users: FollowDataArray = await prisma.user.findMany({
    where: {
      following: {
        some: {
          followerId: user?.id,
        },
      },
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
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const posts = users.flatMap((user) => {
    return user.posts.map((post) => {
      return {
        id: post.id,
        createdAt: post.createdAt,
        title: post.title,
        authorId: post.authorId,
        author: {
          id: user.id,
          createdAt: user.createdAt,
          image: user.image,
          update: user.update,
          name: user.name,
        },
        likes: post.likes.map((like) => ({
          userId: like.userId,
        })),
      };
    });
  });
  return posts;
}

export async function postDeleteAction(postId: string) {
  const userId = await fetchUserId();
  await prisma.post.delete({
    where: {
      id: postId,
    },
  });
  revalidatePath(`/myprofile/${userId}`);
}

export async function userDeleteAction() {
  const userId = await fetchUserId();
  await prisma.user.delete({
    where: {
      id: userId,
    },
  });
  revalidatePath("/");
}

export async function ProfileFollowAction(uniqueData: ProfileData) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  try {
    const existingFollowerField = await prisma.follower.findFirst({
      where: {
        AND: [
          { followingId: uniqueData.id },
          ...(user?.id ? [{ followerId: user.id }] : []),
        ],
      },
    });
    console.log("called");
    if (existingFollowerField) {
      await prisma.follower.delete({
        where: {
          id: existingFollowerField.id,
        },
      });
      revalidatePath(`/profile/${uniqueData.id}`);
    } else {
      if (user?.id) {
        await prisma.follower.create({
          data: {
            followerId: user?.id,
            followingId: uniqueData.id,
          },
        });
        revalidatePath(`/profile/${uniqueData.id}`);
      } else {
        console.log("user is not authenticated");
      }
    }
  } catch (err) {
    console.log(err);
  }
}

export async function likeAction(
  uniquePostData: PostsProps,
  userId: string | null,
) {
  try {
    if (!userId) {
      return;
    };

    const existingLikeField = await prisma.like.findFirst({
      where: {
        postId: uniquePostData.id,
        userId: userId,
      },
    });

    if (existingLikeField) {
      await prisma.like.delete({
        where: {
          id: existingLikeField.id,
        },
      });
      revalidatePath(`/blogpages/${uniquePostData.id}`);
    } else {
      if (userId) {
        await prisma.like.create({
          data: {
            userId: userId,
            postId: uniquePostData.id,
          },
        });
        revalidatePath(`/blogpages/${uniquePostData.id}`);
      } else {
        console.log("user is not authenticated");
      }
    }
  } catch (err) {
    console.log(err);
  }
}

export async function blogPageFollowAction(
  uniquePostData: PostsProps,
  userId: string | null,
) {
  try {
    if (!userId) {
      return;
    };

    const existingFollowerField = await prisma.follower.findFirst({
      where: {
        followingId: uniquePostData.authorId,
        followerId: userId,
      },
    });

    if (existingFollowerField) {
      await prisma.follower.delete({
        where: {
          id: existingFollowerField.id,
        },
      });
      revalidatePath(`/blogpages/${uniquePostData.id}`);
    } else {
      if (userId) {
        await prisma.follower.create({
          data: {
            followerId: userId,
            followingId: uniquePostData.authorId,
          },
        });
        revalidatePath(`/blogpages/${uniquePostData.id}`);
      } else {
        console.log("user is not authenticated");
      }
    }
  } catch (err) {
    console.log(err);
  }
}
