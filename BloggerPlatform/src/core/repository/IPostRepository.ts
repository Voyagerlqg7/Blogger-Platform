import {Post} from "../entities/Post";
import {Comment} from "../entities/Comment";
import {UpdatePostByIdDTO,CreatePostByBlogIdDTO,CreateCommentDTO} from "./DTO/PostDTO";

export interface IPostRepository {
    getAllPosts():Promise<Post[]>;
    getPostById(postId:string):Promise<Post>;
    deletePostById(postId:string):Promise<void>;
    updatePostById(postId:string, dto:UpdatePostByIdDTO):Promise<Post>;
    createPostByBlogId(dto:CreatePostByBlogIdDTO):Promise<Post>;
    createNewCommentUnderPost(postId:string, dto:CreateCommentDTO):Promise<Comment>;
    getAllCommentsByPostId(postId:string):Promise<Comment>;
}