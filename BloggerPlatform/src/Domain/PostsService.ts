import {PostDBController} from "../Repository/PostDBController";
import {blogsDBCollection} from "../Repository/BlogsDBController";
import {PostsDB, PostsPage} from "../Objects/Posts";
import {ObjectId} from "mongodb";
import {PostsQueryParams} from "../routes/PostsRoutes";


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
    }
};
