export class Post {
    constructor(
        public readonly id: string,
        public title: string,
        public content: string,
        public shortDescription: string,
        public blogId: string,
        public blogName: string,
        public createdAt: string,
        public extendedLikesInfo: {
            likesCount: number,
            dislikesCount: number,
            myStatus: string,
            newestLikes: {
                addedAt: string,
                userId: string,
                login: string
            }[];
        }
    ) {
    }
}

export class PostLike {
    constructor(
        public userId: string,
        public postId: string,
        public login:string,
        public status: "Like" | "Dislike",
        public createdAt: string
    ) {
    }
}