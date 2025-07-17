import {IPostRepository} from "../../repository/IPostRepository";
import {Post} from "../../entities/Post";

export class GetAllPostsFromSpecialBlogService {
    constructor(private readonly postRepository: IPostRepository) {}
    async execute(blogId:string): Promise<Post[]> {
        return await this.postRepository.getAllPostsByBlogId(blogId);
    }
}