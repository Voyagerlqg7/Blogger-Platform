import {IBlogRepository} from "../../repository/IBlogRepository";
import {Blog} from "../../entities/Blog";
import {UpdateBlogDTO} from "../../repository/DTO/BlogDTO";

export class UpdateBlogByIDService {
    constructor(private readonly blogRepository: IBlogRepository) {}
    async execute(blogId:string, dto:UpdateBlogDTO): Promise<void | null> {
        const blog = await this.blogRepository.getBlogById(blogId);
        if (!blog) {
            throw new Error("Blog not found");
        }
        await this.blogRepository.updateBlogById(blogId, dto);

    }
}