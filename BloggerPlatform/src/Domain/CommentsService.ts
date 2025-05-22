import {CommentDB} from "../Objects/Comments";
import {CommentsDBController} from "../Repository/CommentsDBController";

export const CommentsService = {
    async GetCommentById(commentId:string):Promise<CommentDB| undefined>{
        const comment = await CommentsDBController.GetCommentById(commentId);
        return comment;
    },
    async UpdateCommentById(commentId:string):Promise<CommentDB| undefined>{
        const comment = await CommentsDBController.UpdateCommentById(commentId);
        return comment;
    },
    async DeleteCommentById(commentId:string){

    }
};