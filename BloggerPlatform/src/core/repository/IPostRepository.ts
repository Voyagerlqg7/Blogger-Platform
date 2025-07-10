import {Post} from "../entities/Post";
import {Comment} from "../entities/Comment";

export interface IPostRepository {
    getAllPosts():Post;
    getPostById(id:string):Post;
    deletePostById(id:string):void;
    updatePostById(id:string, title:string, shortDescription:string,content:string, blogId:string):Post;
    createPostByBlogId(blogId:string, title:string,shortDescription:string, content:string):Post;
    createNewCommentUnderPost(postId:string, content:string):Comment;
    getAllCommentsByPostId(postId:string):Comment;
}