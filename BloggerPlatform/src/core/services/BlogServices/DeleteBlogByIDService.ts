import {IBlogRepository} from "../../repository/IBlogRepository";

export class DeleteBlogByIDService {
    constructor(private readonly blogRepository: IBlogRepository) {}
    async execute(blogId:string): Promise<void | null> {
        const blog = await this.blogRepository.getBlogById(blogId);
        if (!blog) {
            throw new Error("Blog not found");
        }
        return await this.blogRepository.deleteBlogById(blogId);
    }
}