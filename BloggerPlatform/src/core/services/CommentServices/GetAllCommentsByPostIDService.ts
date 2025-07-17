import {ICommentsRepository} from "../../repository/ICommentsRepository";
import {IPostRepository} from "../../repository/IPostRepository";
import {Comment} from "../../entities/Comment";

export class GetAllCommentsByPostIDService {
    constructor(private readonly commentRepository: ICommentsRepository,
                private readonly postRepository: IPostRepository) {}
    async execute(postId:string): Promise<Comment[]> {
        const post = await this.postRepository.getPostById(postId);
        if (!post) {
            throw new Error("Post not found.");
        }
        return await this.commentRepository.getAllCommentsByPostID(postId);
    }
}