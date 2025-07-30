import {ObjectId} from "mongodb";

export type CommentDB = {
    _id: ObjectId,
    content: string,
    commentatorInfo: {
        "userId": string,
        "userLogin": string
    },
    createdAt: Date,
    postId: ObjectId,
}