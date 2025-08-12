import {PostDBController, postsDBCollection} from "../Repository/PostDBController";
import {blogsDBCollection} from "../Repository/BlogsDBController";
import {ObjectId} from "mongodb";
import {PostsQueryParams} from "../routes/PostsRoutes";
import {PostsDB} from "../infrastructure/db/models/PostModel";
import {Comment} from "../core/entities/Comment";
import {CommentDB} from "../infrastructure/db/models/CommentModel";
import {v4 as uuidv4} from "uuid";


export const PostsService = {
    async GetAllPosts(queryParams:PostsQueryParams): Promise<PostsPage | undefined> {
        return PostDBController.GetAllPosts(queryParams);
    },
    async GetPostByID(id: string): Promise<PostsDB | undefined> {
        return PostDBController.GetPostByID(id);
    },
    async AddNewPost(post: PostsDB): Promise<PostsDB | undefined> {
        if (!ObjectId.isValid(post.blogId)) {
            console.error("Invalid blogId:", post.blogId);
            return undefined;
        }
        const blog = await blogsDBCollection.findOne({_id: new ObjectId(post.blogId)});
        if (!blog) {
            console.error("Blog not found for blogId:", post.blogId);
            return undefined;
        }
        const newPost = {
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: blog.name,
            createdAt: new Date().toISOString(),
        };
        return await PostDBController.AddNewPost(newPost);
    },
    async DeletePostByID(id: string | null): Promise<boolean> {
        return await PostDBController.DeletePostByID(id);
    },
    async UpdatePostByID(id: string, post: PostsDB): Promise<PostsDB | undefined> {
        return await PostDBController.UpdatePostByID(id, post);
    },
    async CreateComment(text:string, userId:string, userLogin:string, postId:string):Promise<CommentViewModel| undefined>{
        const existingPost = await postsDBCollection.findOne({_id: new ObjectId(postId)});
        if(!existingPost) {
            return undefined;
        }
        const id = uuidv4();
        const newComment:CommentDB = {
            id: ,
            content: text,
            commentatorInfo: {
                userId: userId,
                userLogin: userLogin
            },
            createdAt: new Date(),
            postId: new ObjectId(postId)
        }
        const result = await PostDBController.AddCommentUnderPost(newComment);
        return result;
    },
    async GetCommentsFromPost(postId: string, queryParams:PostsQueryParams): Promise<CommentPage | undefined> {
        const existingPost = await postsDBCollection.findOne({_id: new ObjectId(postId)});
        if(!existingPost) {
            console.error(`Post not found for ID: ${postId}`);
            return undefined;
        }
        return PostDBController.GetAllCommentsFromPost(postId, queryParams);
    },
};
