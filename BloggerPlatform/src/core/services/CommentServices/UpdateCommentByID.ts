import{ICommentsRepository} from "../../repository/ICommentsRepository";
import {Comment} from "../../entities/Comment";

export class UpdateCommentByID {
    constructor(private readonly commentRepository: ICommentsRepository) {}
    async execute(commentId: string, content:string): Promise<Comment | null> {
        const comment = await this.commentRepository.getCommentById(commentId);
        if (!comment) {
            throw new Error("Post not found");
        }
        return await this.commentRepository.updateCommentById(commentId, content);
    }
}