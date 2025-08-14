import {IPostRepository} from "../repository/IPostRepository";
import {Post} from "../entities/Post";
import {v4 as uuidv4} from "uuid";
import {Comment} from "../entities/Comment";
import {CreatePostDTO, UpdatePostByIdDTO} from "../repository/DTO/PostDTO";
import {IBlogRepository} from "../repository/IBlogRepository";

export class PostService {
    constructor(private readonly postRepository: IPostRepository,
                private readonly blogRepository: IBlogRepository) {}
    async getAllPosts(): Promise<Post[]> {
        return await this.postRepository.getAllPosts();
    }
    async getAllCommentsFromPost(postId:string):Promise<Comment[]> {
        const post = await this.postRepository.getPostById(postId);
        if (!post) {throw new Error("Post not found.");}
        return await this.postRepository.getAllCommentsByPostID(postId);
    }
    async createCommentUnderPost(
        postId: string,
        content: string,
        userId: string,
        userLogin: string
    ): Promise<Comment> {
        const post = await this.postRepository.getPostById(postId);
        if (!post) throw new Error("Could not find post with id " + postId);

        const id = uuidv4();
        const newComment: Comment = new Comment(
            id,
            content,
            { userId, userLogin },
            new Date().toISOString()
        );
        return this.postRepository.createCommentByPostID(postId, newComment);
    }

    async createPost(dto: CreatePostDTO): Promise<Post> {
        const blog = await this.blogRepository.getBlogById(dto.blogId);
        if (!blog) {throw new Error("Cannot find blog with id 'blogId': " + dto.blogId);}
        const id = uuidv4();
        const newPost = new Post(
            id,
            dto.title,
            dto.content,
            dto.shortDescription,
            dto.blogId,
            blog.name,
            new Date().toISOString()
        )
        return await this.postRepository.createPost(newPost);
    }
    async getPostById(postId:string):Promise<Post|null>{
        return await this.postRepository.getPostById(postId);
    }
    async updatePostById(postId:string, dto:UpdatePostByIdDTO):Promise<void>{
        const post = await this.postRepository.getPostById(postId);
        if (!post) {throw new Error("Post not found");}
        return await this.postRepository.updatePostById(postId, dto);
    }
    async deletePostById(postId:string):Promise<void | null>{
        const post = await this.postRepository.getPostById(postId);
        if (!post) {throw new Error("Post not found");}
        return await this.postRepository.deletePostById(postId);
    }

}
