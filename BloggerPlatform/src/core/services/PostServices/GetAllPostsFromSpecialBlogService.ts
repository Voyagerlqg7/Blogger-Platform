import {IPostRepository} from "../../repository/IPostRepository";
import {IBlogRepository} from "../../repository/IBlogRepository";
import {Post} from "../../entities/Post";

export class GetAllPostsFromSpecialBlogService {
    constructor(private readonly postRepository: IPostRepository,
                private readonly blogRepository: IBlogRepository) {}
    async execute(blogId:string): Promise<Post[]> {
        const blog = await this.blogRepository.getBlogById(blogId);
        if (!blog) {
            throw new Error(`Blog with id ${blogId} not found`);
        }
        return await this.postRepository.getAllPostsByBlogId(blogId);
    }
}