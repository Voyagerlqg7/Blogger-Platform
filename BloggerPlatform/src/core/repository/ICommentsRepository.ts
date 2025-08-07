import {Comment} from "../entities/Comment";

export interface ICommentsRepository {
    getCommentById(commentId:string):Promise<Comment | null>;
    deleteCommentById(commentId:string):Promise<void>;
    updateCommentById(commentId:string, content:string):Promise<void>;
}