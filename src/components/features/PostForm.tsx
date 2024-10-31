"use client"

import Button from "@/components/elements/Button";
import Input from "@/components/elements/Input";
import Textarea from "@/components/elements/Textarea";
import { postAction } from "../../../lib/actions";
import { useState } from "react";

export default function PostForm() {
    const [error, setError] = useState<string | undefined>("");

    const handleSubmit = async (formData: FormData) => {
        const result = await postAction(formData);
        if (!result.success) {
            setError(result.error);
        } else {
            setError("");
            window.location.href = '/';
        }
    }

    return (
        <div className="absolute h-[calc(100%-80px)] w-3/5 left-1/2 -translate-x-1/2 p-6">
            <form action={handleSubmit} className="flex flex-col h-full bg-white">
                <div className="h-[8%] pl-2 pt-2 pr-2">
                    <Input name="postTitle" placeholder="Title" className="h-full w-full p-1 rounded-none focus:outline-none border border-gray-700" />
                </div>
                <div className="h-[82%] pl-2 pt-2 pr-2">
                    <Textarea name="postContent" />
                </div>
                <div className={`h-[10%] flex items-center gap-2 pr-2 pl-2 ${!error ? "justify-end" : "justify-between"}`}>
                    {error && <p className="text-red-500 pl-1">{error}</p>}
                    <Button type="submit" className="w-12 font-bold bg-slate-50">post</Button>
                </div>
            </form >
        </div>
    );
}