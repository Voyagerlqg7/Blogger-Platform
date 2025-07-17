import { Comment } from "../../entities/Comment";
import { ICommentsRepository } from "../../repository/ICommentsRepository";

export class GetCommentByIDService {
    constructor(private readonly commentRepository: ICommentsRepository) {}
    async execute(commentId: string): Promise<Comment | null> {
        return await this.commentRepository.getCommentById(commentId);
    }
}
