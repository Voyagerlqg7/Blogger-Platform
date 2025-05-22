import {CommentDB} from "../Objects/Comments";
import {CommentsDBController} from "../Repository/CommentsDBController";

export const CommentsService = {
    async GetCommentById(commentId:string):Promise<CommentDB| undefined>{
        const comment = await CommentsDBController.GetCommentById(commentId);
        return comment;
    },
    async UpdateCommentById(commentId:string, text:string):Promise<CommentDB| undefined>{
        const comment = await CommentsDBController.UpdateCommentById(commentId, text);
        return comment;
    },
    async DeleteCommentById(commentId:string){
        const comment = await CommentsDBController.DeleteCommentById(commentId);
        return comment;
    }
};