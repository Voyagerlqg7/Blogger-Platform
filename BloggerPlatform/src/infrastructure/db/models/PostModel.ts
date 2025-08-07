import {ObjectId} from "mongodb";

export type PostsDB = {
    _id: ObjectId,
    title: string,
    shortDescription: string,
    content: string,
    blogId: ObjectId,
    blogName: string
    createdAt: Date;
}