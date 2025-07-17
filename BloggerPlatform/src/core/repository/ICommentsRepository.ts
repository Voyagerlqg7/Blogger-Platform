import {Comment} from "../entities/Comment";
import {CreateCommentDTO} from "./DTO/CreateCommentDTO";

export interface ICommentsRepository {
    getCommentById(commentId:string):Promise<Comment>;
    deleteCommentById(commentId:string):Promise<void | null>;
    updateCommentById(commentId:string, content:string):Promise<Comment | null>;
    getAllCommentsByPostID(postId:string): Promise<Comment[]>;
    createCommentByPostID(postId:string, dto:CreateCommentDTO):Promise<Comment | null>;
}