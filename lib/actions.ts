"use server";

import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import prisma from "./prisma";

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
