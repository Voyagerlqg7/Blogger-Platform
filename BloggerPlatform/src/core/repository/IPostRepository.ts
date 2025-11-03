import {Post, PostLike} from "../entities/Post";
import {Comment} from "../entities/Comment";
import {UpdatePostByIdDTO} from "./DTO/PostDTO";
import {PostsQueryDTO,PagedResponse} from "./DTO/QueryParamsDTO";

export interface IPostRepository {
    getAllPosts(Q_params:PostsQueryDTO,userId?:string):Promise<PagedResponse<Post>>;
    getPostById(postId:string, userId?:string):Promise<Post|null>;
    deletePostById(postId:string):Promise<void | null>;
    updatePostById(postId:string, dto:UpdatePostByIdDTO):Promise<void>;
    createPost(post:Post):Promise<Post>;
    getAllCommentsByPostID(postId:string, Q_params:PostsQueryDTO, userId?:string):Promise<PagedResponse<Comment>>;
    createCommentByPostID(postId:string, comment:Comment):Promise<Comment>;

    updateLikesCount(postId:string, likesCount:number, dislikeCount:number):Promise<void>;
    getUserLikes(userId: string, postIds:string[]):Promise<PostLike[]>;
    setLike(userId: string,
            postId: string,
            login: string,
            status: "Like" | "Dislike" | "None"):Promise<void>;
    countLikes(postId:string):Promise<number>;
    countDislikes(postId:string):Promise<number>;
}