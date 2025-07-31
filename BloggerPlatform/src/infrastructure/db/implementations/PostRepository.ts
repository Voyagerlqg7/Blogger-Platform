import {Post} from "../../../core/entities/Post";
import {PostsDB} from "../models/PostModel";
import {IPostRepository} from "../../../core/repository/IPostRepository";

export class PostRepository implements IPostRepository {
    async getAllPosts(): Promise<Post[]> {

    }
    async getPostById(blogId:string):Promise<Post> {

    }
    async deletePostById(blogId:string):Promise<void> {

    }
    async updatePostById(postId:string){

    }
    async createPostByBlogId(post:Post){

    }
    async getAllCommentsByPostId(blogId:string):Promise<Comment[]> {

    }
    async getAllPostsByBlogId(blogId:string):Promise<Post[]> {

    }

}
