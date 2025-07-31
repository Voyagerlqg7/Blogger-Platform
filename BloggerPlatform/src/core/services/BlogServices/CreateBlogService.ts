import {IBlogRepository} from "../../repository/IBlogRepository";
import {Blog} from "../../entities/Blog";
import {CreateBlogDTO} from "../../repository/DTO/BlogDTO";
import {v4 as uuidv4} from 'uuid'


export class CreateBlogService {
    constructor(readonly blogRepository: IBlogRepository) {}
    async execute(dto:CreateBlogDTO): Promise<Blog> {
        const id = uuidv4();
        const newBlog = new Blog(
            id,
            dto.name,
            dto.description,
            dto.websiteUrl,
            new Date().toISOString(),
            false
        );
        return await this.blogRepository.createBlog(newBlog);
    }
}