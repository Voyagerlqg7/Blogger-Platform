import {Comment} from "../entities/Comment";

export interface ICommentsRepository {
    getCommentById(commentId:string):Promise<Comment | null>;
    deleteCommentById(commentId:string):Promise<void | null>;
    updateCommentById(commentId:string, content:string):Promise<void | null>;
    getAllCommentsByPostID(postId:string): Promise<Comment[]>;
    createCommentByPostID(postId:string, comment:Comment):Promise<Comment | null>;
}