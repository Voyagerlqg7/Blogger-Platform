import {Post} from "../entities/Post";
import {Comment} from "../entities/Comment";
import {UpdatePostByIdDTO,CreatePostByBlogIdDTO} from "./DTO/PostDTO";

export interface IPostRepository {
    getAllPosts():Promise<Post[]>;
    getPostById(postId:string):Promise<Post|null>;
    deletePostById(postId:string):Promise<void|null>;
    updatePostById(postId:string, dto:UpdatePostByIdDTO):Promise<Post>;
    createPostByBlogId(dto:CreatePostByBlogIdDTO):Promise<Post>;
    getAllCommentsByPostId(postId:string):Promise<Comment[]>;
    getAllPostsByBlogId(blogId:string):Promise<Post[]>;
}