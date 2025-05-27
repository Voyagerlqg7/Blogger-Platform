import {ObjectId} from "mongodb";

export type CommentDB = {
    id?: string,
    content: string,
    commentatorInfo: {
        "userId": string,
        "userLogin": string
    },
    createdAt?: string,
    postId?: ObjectId,
}
export type NewComment={
    content: string
}
export type CommentViewModel = {
    id?: string;
    content: string;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    };
    createdAt?: string;
};
//for future pagination
export type CommentPage = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: CommentViewModel[];
}