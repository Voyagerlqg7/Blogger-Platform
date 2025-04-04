import {BlogsDBController} from "../Controllers/BlogsDBController";
import {PostDBController} from "../Controllers/PostDBController";
import {blogsDBCollection} from "../Controllers/BlogsDBController";
import {BlogsDB} from "../Objects/Blogs";
import {PostsDB} from "../Objects/Posts";
import {ObjectId} from "mongodb";

export const BusinessLayer = {
    async GetAllBlogs(): Promise<BlogsDB[]> {
        return BlogsDBController.GetAllBlogs();
    },
    async GetAllPosts(): Promise<PostsDB[]> {
        return PostDBController.GetAllPosts();
    },

    async GetBlogByID(id: string): Promise<BlogsDB | undefined> {
        return BlogsDBController.GetBlogByID(id);
    },
    async GetPostByID(id: string): Promise<PostsDB | undefined> {
        return PostDBController.GetPostByID(id);
    },

    async AddNewBlog(blog: BlogsDB): Promise<BlogsDB | undefined> {
        const newBlog = {
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        };
        return await BlogsDBController.AddNewBlog(newBlog);
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

    async DeleteBlogByID(id: string | null): Promise<boolean> {
        return await BlogsDBController.DeleteBlogByID(id);
    },
    async DeletePostByID(id: string | null): Promise<boolean> {
        return await PostDBController.DeletePostByID(id);
    },

    async UpdateBlogByID(id: string, blog: BlogsDB): Promise<BlogsDB | undefined> {
        return await BlogsDBController.UpdateBlogByID(id, blog);
    },
    async UpdatePostByID(id: string, post: PostsDB): Promise<PostsDB | undefined> {
        return await PostDBController.UpdatePostByID(id, post);
    }
};
