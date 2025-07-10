import {Comment} from "../entities/Comment";

export interface ICommentsRepository {
    getCommentsById(id:string):Comment;
    DeleteCommentById(id:string):void;
    UpdateCommentById(id:string):Comment;
}