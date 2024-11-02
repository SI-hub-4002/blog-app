export interface PostsProps {
    id: string;
    createdAt: Date;
    title: string;
    content?: string;
    authorId: string;
    update?: Date;
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

export type PostsPropsArray = PostsProps[];

export interface UsersProps {
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

export interface BlogPageLayoutProps {
    postsProps: PostsProps[];
    usersProps: UsersProps[];
};

export interface ProfileData {
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

export interface ProfileLayoutProps {
    data: ProfileData[]
}

export interface StatProps {
    count: number,
    label: string,
}
