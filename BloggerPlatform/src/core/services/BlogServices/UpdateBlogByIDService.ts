import {IBlogRepository} from "../../repository/IBlogRepository";
import {Blog} from "../../entities/Blog";
import {UpdateBlogDTO} from "../../repository/DTO/BlogDTO";

export class UpdateBlogByIDService {
    constructor(private readonly blogRepository: IBlogRepository) {}
    async execute(blogId:string, dto:UpdateBlogDTO): Promise<Blog> {
        const blog = await this.blogRepository.getBlogById(blogId);
        if (!blog) {
            throw new Error("Blog not found");
        }
        return await this.blogRepository.updateBlogById(blogId, dto);

    }
}