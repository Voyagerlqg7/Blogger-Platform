import {IPostRepository} from "../../repository/IPostRepository";
import {Post} from "../../entities/Post";
import {IBlogRepository} from "../../repository/IBlogRepository";
import {CreatePostByBlogIdDTO} from "../../repository/DTO/PostDTO";
import {v4 as uuidv4} from 'uuid'

export class CreatePostByBlogIDService {
    constructor(private readonly postRepository: IPostRepository,
                private readonly blogRepository: IBlogRepository,) {
    }
    async execute(dto:CreatePostByBlogIdDTO): Promise<Post | null> {
        const blog = await this.blogRepository.getBlogById(dto.blogId);
        if (!blog) {
            throw new Error("Cannot find blog with id 'blogId': " + dto.blogId);
        }
        const id = uuidv4();
        const newPost = new Post(
            id,
            dto.title,
            dto.content,
            dto.shortDescription,
            dto.blogId,
            new Date().toISOString()
        )
        return await this.postRepository.createPostByBlogId(newPost);
    }
}