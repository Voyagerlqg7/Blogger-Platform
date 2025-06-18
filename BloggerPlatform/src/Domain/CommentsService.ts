import {CommentDB, CommentViewModel} from "../Objects/Comments";
import {CommentsDBController} from "../Repository/CommentsDBController";
import {ObjectId} from "mongodb";

export const CommentsService = {
    async GetCommentById(commentId:string):Promise<CommentViewModel| undefined>{
        const comment = await CommentsDBController.GetCommentById(commentId);
        return comment;
    },
    async UpdateCommentById(commentId: string, text: string, userId: string): Promise<CommentViewModel | undefined | false | null> {
        const existingComment = await CommentsDBController.GetCommentById(commentId);
        if (!existingComment) return null;

        if (existingComment.commentatorInfo.userId !== userId) {
            return false; // чужой комментарий
        }

        const updatedComment = await CommentsDBController.UpdateCommentText(commentId, text);
        return updatedComment;
    },
    async DeleteCommentById(commentId: string, userId: string): Promise<true | false | null> {
        const existingComment = await CommentsDBController.GetCommentById(commentId);
        if (!existingComment) return null; // комментарий не найден

        if (existingComment.commentatorInfo.userId !== userId) {
            return false; // не твой комментарий
        }

        const deleted = await CommentsDBController.DeleteCommentById(commentId);
        return deleted ? true : null;
    }

};