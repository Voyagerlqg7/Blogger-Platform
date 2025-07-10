import {Post} from "../entities/Post";
import {Comment} from "../entities/Comment";
import {UpdatePostByIdDTO,CreatePostByBlogIdDTO,CreateCommentDTO} from "./DTO/PostDTO";

export interface IPostRepository {
    getAllPosts():Post;
    getPostById(postId:string):Post;
    deletePostById(postId:string):void;
    updatePostById(postId:string, dto:UpdatePostByIdDTO):Post;
    createPostByBlogId(dto:CreatePostByBlogIdDTO):Post;
    createNewCommentUnderPost(postId:string, dto:CreateCommentDTO):Comment;
    getAllCommentsByPostId(postId:string):Comment;
}