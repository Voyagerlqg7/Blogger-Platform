import {Comment} from "../entities/Comment";

export interface ICommentsRepository {
    getCommentById(id:string):Promise<Comment>;
    DeleteCommentById(id:string):Promise<void>;
    UpdateCommentById(id:string):Promise<Comment>;
}