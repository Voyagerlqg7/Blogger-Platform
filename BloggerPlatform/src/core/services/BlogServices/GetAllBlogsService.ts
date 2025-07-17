import {IBlogRepository} from "../../repository/IBlogRepository";
import {Blog} from "../../entities/Blog";

export class GetAllBlogsService {
    constructor(private readonly blogRepository: IBlogRepository) {}
    async execute(): Promise<Blog[]> {
        return await this.blogRepository.getAllBlogs();
    }
}