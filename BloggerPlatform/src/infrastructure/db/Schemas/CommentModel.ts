import mongoose from "mongoose";

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

export const CommentSchema = new mongoose.Schema<CommentDB>({
    _id: { type: String, required: true },
    content: { type: String },
    commentatorInfo:({
        userId: {type: String, required: true},
        userLogin: {type: String, required: true},
    }),
    createdAt: {type: Date, required: true},
    postId: {type: String, required: true},
})