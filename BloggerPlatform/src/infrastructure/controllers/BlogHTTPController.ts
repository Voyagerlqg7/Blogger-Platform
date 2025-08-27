import {Request, Response} from "express";
import {blogService} from "../composition";

export const getAllBlogsHandler = async (req: Request, res: Response) => {
    const blogs = await blogService.getAllBlogs();
    res.status(200).json(blogs);
};

export const getBlogByIdHandler = async (req: Request, res: Response) => {
    const blog = await blogService.getBlogById(req.params.id);
}

export const createBlogHandler = async (req: Request, res: Response) => {
    const { name, description, websiteUrl } = req.body;
    const dto = { name, description, websiteUrl };
    const blog = await blogService.createBlog(dto);
    if (!blog) {
        res.status(400).send();
    }
    res.status(201).json(blog);
};

export const updateBlogHandler = async (req: Request, res: Response) => {
    const { name, description, websiteUrl } = req.body;
    const dto = { name, description, websiteUrl };
    const blogToUpdate = await blogService.updateBlogById(req.params.id,dto);
    if (!blogToUpdate) {res.status(400).send();}
    else{res.status(201).send(blogToUpdate);}
}

export const deleteBlogHandler = async (req: Request, res: Response) => {
    const blogToDelete = await blogService.deleteBlogById(req.params.id);
    if (!blogToDelete) {res.status(404).send();}
    else{res.status(204).send();}
}

export const getAllPostsFromBlogHandler = async (req: Request, res: Response) => {
    const posts = await blogService.getAllPostsFromBlog(req.params.id);
    if(!posts.length) {res.status(404).send();}
    else{res.status(200).send(posts);}
}

export const createPostForSpecialBlogHandler = async (req: Request, res: Response) => {
    const {title, shortDescription,content} = req.body;
    const dto = { title, shortDescription, content };
    const newPostToBlog = await blogService.createNewPostForSpecialBlog(req.params.blogId, dto);

}
