import {Comment} from "../entities/Comment";
import {ICommentsRepository} from "../repository/ICommentsRepository";

export class CommentService {
    constructor(private readonly commentRepository: ICommentsRepository) {}
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
}
