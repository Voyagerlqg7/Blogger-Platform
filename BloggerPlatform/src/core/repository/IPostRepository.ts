import {Post} from "../entities/Post";
import {Comment} from "../entities/Comment";
import {UpdatePostByIdDTO} from "./DTO/PostDTO";

export interface IPostRepository {
    getAllPosts():Promise<Post[]>;
    getPostById(postId:string):Promise<Post|null>;
    deletePostById(postId:string):Promise<void | null>;
    updatePostById(postId:string, dto:UpdatePostByIdDTO):Promise<void>;
    createPost(post:Post):Promise<Post>;
    getAllCommentsByPostID(postId:string):Promise<Comment[]>;
    createCommentByPostID(postId:string, comment:Comment):Promise<Comment>;
}