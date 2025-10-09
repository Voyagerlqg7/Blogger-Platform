export class Comment {
    constructor(
        public readonly id: string,
        public content: string,
        public commentatorInfo:{
            userId: string,
            userLogin: string,
        },
        public createdAt: string,
        public likesInfo:{
            likesCount: number,
            dislikesCount: number,
            myStatus: "Like" | "Dislike" | "None",
        }
    ){}
}
export class CommentLike {
    constructor(
        public userId: string,
        public commentId: string,
        public status: "Like" | "Dislike",
        public createdAt: string
    ) {}
}