import {IBlogRepository} from "../../repository/IBlogRepository";
import {Blog} from "../../entities/Blog";

export class GetBlogByIDService {
    constructor(private readonly blogRepository: IBlogRepository) {}
    async execute(blogId:string): Promise<Blog | null> {
        return await this.blogRepository.getBlogById(blogId);
    }
}