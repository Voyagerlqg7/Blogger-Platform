import {BlogsDB} from "../DataB/Blogs";
import {blogs} from "../DataB/Blogs";

export const BlogsController = {
    GetAllBlogs (): BlogsDB[] {
        return blogs;
    },
    GetBlogByID(id: string | null): BlogsDB | undefined {
        if (!id) return undefined;
        return blogs.find(blog => blog.id === id);
    },
    AddNewBlog (blog: BlogsDB): BlogsDB | undefined {
        let newBlog ={
            id: new Date().getTime().toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl
        }
        blogs.push(newBlog);
        return newBlog;
    },
    DeleteBlogByID(id: string | null): BlogsDB | undefined {
        const blog = blogs.find(blog => blog.id === id);
        if (blog) {
            blogs.splice(blogs.indexOf(blog), 1);
            return blog;
        }
        else{return undefined;}
    }
};