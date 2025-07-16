import {IBlogRepository} from "../../repository/IBlogRepository";
import {Blog} from "../../entities/Blog";
import {CreateBlogDTO} from "../../repository/DTO/BlogDTO";
import {v4 as uuidv4} from 'uuid'


export class CreateBlogService {
    constructor(private readonly blogRepository: IBlogRepository) {}
    async execute(dto:CreateBlogDTO): Promise<Blog> {
        const id = uuidv4();
        const newBlog = new Blog(
            id,
            dto.name,
            dto.description,
            dto.websiteUrl,
            false,
            new Date().toISOString()
        );
        return await this.blogRepository.createBlog(newBlog);
    }
}