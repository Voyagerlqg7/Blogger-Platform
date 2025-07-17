import { ICommentsRepository } from "../../repository/ICommentsRepository";

export class DeleteCommentByIDService {
    constructor(private readonly commentRepository: ICommentsRepository) {}
    async execute(commentId: string): Promise<void | null> {
        const comment = await this.commentRepository.getCommentById(commentId);
        if (!comment) {
            throw new Error("Could not find comment with id " + commentId);
        }
        return await this.commentRepository.deleteCommentById(commentId);
    }
}
