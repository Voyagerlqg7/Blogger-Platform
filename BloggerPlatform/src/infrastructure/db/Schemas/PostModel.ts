import mongoose from "mongoose"

export type PostsDB = {
    _id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
    createdAt: Date;
    likesCount: number;
    dislikesCount: number;
}

export const PostSchema = new mongoose.Schema<PostsDB>({
    _id: { type: String, required: true },
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    content: { type: String, required: true },
    blogId: { type: String, required: true },
    blogName: { type: String, required: true },
    createdAt: { type: Date, required: true },
    likesCount: {type: Number, required: true},
    dislikesCount: {type: Number, required: true}
})
export const PostLikeSchema = new mongoose.Schema({
    userId:String,
    postId:String,
    status:{type:String, enum:["Like","Dislike"]},
    createdAt:Date,
})