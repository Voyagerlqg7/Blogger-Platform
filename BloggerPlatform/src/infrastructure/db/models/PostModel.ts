import {ObjectId} from "mongodb";

export type PostsDB = {
    _id: ObjectId,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
    createdAt: Date;
}