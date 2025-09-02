export type CommentDB = {
    _id: string,
    content: string,
    commentatorInfo: {
        userId: string,
        userLogin: string
    },
    createdAt: Date,
    postId: string
}