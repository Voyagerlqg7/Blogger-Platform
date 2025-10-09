import mongoose from "mongoose";

export type CommentDB = {
    _id: string,
    content: string,
    commentatorInfo: {
        userId: string,
        userLogin: string
    },
    createdAt: Date,
    postId: string,
    likesCount: number;
    dislikesCount: number;
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
    likesCount: {type: Number, required: true},
    dislikesCount: {type: Number, required: true}
})

export const CommentLikeSchema = new mongoose.Schema({
    userId:String,
    commentId:String,
    status:{type:String, enum:["Like","Dislike"]},
    createdAt:Date,
})