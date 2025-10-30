export class Post {
    constructor(
                public readonly id: string,
                public title: string,
                public content: string,
                public shortDescription: string,
                public blogId: string,
                public blogName: string,
                public createdAt: string,
                public likesInfo:{
                    likesCount: number,
                    dislikesCount: number,
                    myStatus: string,
                }
    ){}
}
export class PostLike {
    constructor(
        public userId: string,
        public postId: string,
        public status: "Like" | "Dislike",
        public createdAt: string
    ) {}
}