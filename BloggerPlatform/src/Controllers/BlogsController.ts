import {BlogsDB} from "../Objects/Blogs";
import {blogs} from "../Objects/Blogs";

export const BlogsController = {
    async GetAllBlogs (): Promise<BlogsDB[]> {
        return blogs;
    },
    async GetBlogByID(id: string | null): Promise<BlogsDB | undefined> {
        if (!id) return undefined;
        return blogs.find(blog => blog.id === id);
    },
    async AddNewBlog (blog: BlogsDB): Promise<BlogsDB | undefined> {
        let newBlog ={
            id: new Date().getTime().toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl
        }
        blogs.push(newBlog);
        return newBlog;
    },
    async DeleteBlogByID(id: string | null): Promise<BlogsDB | undefined> {
        const blog = blogs.find(blog => blog.id === id);
        if (blog) {
            blogs.splice(blogs.indexOf(blog), 1);
            return blog;
        }
        else{return undefined;}
    },
    async UpdateBlogByID(id: string, blog: BlogsDB): Promise<BlogsDB | undefined> {
        const updateBlog = blogs.find(b => b.id === id);
        if (updateBlog) {
            updateBlog.name = blog.name;
            updateBlog.description = blog.description;
            updateBlog.websiteUrl = blog.websiteUrl;
            return updateBlog; // Возвращаем обновленный объект
        }
        console.error(`Blog with ID ${id} not found`);
        return undefined;
    }
};