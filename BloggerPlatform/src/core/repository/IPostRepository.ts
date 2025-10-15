import {Post} from "../entities/Post";
import {Comment} from "../entities/Comment";
import {UpdatePostByIdDTO} from "./DTO/PostDTO";
import {PostsQueryDTO,PagedResponse} from "./DTO/QueryParamsDTO";

export interface IPostRepository {
    getAllPosts(Q_params:PostsQueryDTO):Promise<PagedResponse<Post>>;
    getPostById(postId:string):Promise<Post|null>;
    deletePostById(postId:string):Promise<void | null>;
    updatePostById(postId:string, dto:UpdatePostByIdDTO):Promise<void>;
    createPost(post:Post):Promise<Post>;
    getAllCommentsByPostID(postId:string, Q_params:PostsQueryDTO, userId?:string):Promise<PagedResponse<Comment>>;
    createCommentByPostID(postId:string, comment:Comment):Promise<Comment>;
}