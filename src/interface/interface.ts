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
        name: string | null;
        bio?: string | null;
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
    name: string | null;
    bio?: string | null;
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
    name: string | null;
    bio?: string | null;
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

export interface FollowData {
    id: string;
    image: string | null;
    createdAt: Date;
    update: Date;
    name: string | null;
    bio?: string | null;
    posts: {
        id: string;
        title: string;
        authorId: string;
        createdAt: Date;
        likes: {
            userId: string;
        }[];
    }[];
};

export type FollowDataArray = FollowData[];

export interface ProfileLayoutProps {
    data: ProfileData[]
};

export interface StatProps {
    count: number,
    label: string,
};

export interface ModalProps {
    isModalOpen: boolean,
    closeModal: () => void,
    handleUserDeleteAction: (e: React.FormEvent) => Promise<void>,
};

