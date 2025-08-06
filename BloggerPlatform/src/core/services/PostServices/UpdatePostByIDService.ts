import {IPostRepository} from "../../repository/IPostRepository";
import {Post} from "../../entities/Post";
import {UpdatePostByIdDTO} from "../../repository/DTO/PostDTO";

export class UpdatePostByBlogIdService {
    constructor(private readonly postRepository: IPostRepository) {}

    async execute(postId: string, dto: UpdatePostByIdDTO): Promise<Post> {
        const post = await this.postRepository.getPostById(postId);
        if (!post) {
            throw new Error("Post not found");
        }
        return await this.postRepository.updatePostById(postId, dto);
    }
}
