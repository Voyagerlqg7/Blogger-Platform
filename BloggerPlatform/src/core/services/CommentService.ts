import {Comment} from "../entities/Comment";
import {ICommentsRepository} from "../repository/ICommentsRepository";
import { injectable, inject } from "inversify";


@injectable()
export class CommentService {
    constructor(@inject ("ICommentsRepository") private commentRepository: ICommentsRepository) {}

    async deleteCommentById(commentId:string, userId:string):Promise<void| boolean> {
        const comment = await this.commentRepository.getCommentById(commentId);
        if (!comment) {
            throw new Error("Could not find comment with id " + commentId);
        }
        if (comment.commentatorInfo.userId !== userId) {
            return false;
        }
        return await this.commentRepository.deleteCommentById(commentId);
    }
    async getCommentById(commentId:string):Promise<Comment | null> {
        return await this.commentRepository.getCommentById(commentId);
    }
    async updateCommentById(commentId:string, content:string, userId:string):Promise<void | boolean> {
        const comment = await this.commentRepository.getCommentById(commentId);
        if (!comment) {
            throw new Error("Comment not found");
        }
        if (comment.commentatorInfo.userId !== userId) {
            return false;
        }
        return await this.commentRepository.updateCommentById(commentId, content);
    }
    async rateCommentById(userId:string, commentId:string, assessment:string):Promise<void | boolean> {
        const comment = await this.commentRepository.getCommentById(commentId);
        if (!comment) {
            throw new Error("Comment not found");
        }
        if (comment.commentatorInfo.userId !== userId) {
            return false;
        }
        return await this.commentRepository.rateCommentById(userId, commentId, assessment);
    }
}
