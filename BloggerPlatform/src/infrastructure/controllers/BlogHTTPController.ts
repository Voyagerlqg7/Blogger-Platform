import {Request, Response} from "express";
import {BlogsQueryDTO, PostsQueryDTO} from "../../core/repository/DTO/QueryParamsDTO";
import {getQueryParams} from "../helpers/queryHelper";
import {injectable, inject} from "inversify";
import {BlogService} from "../../core/services/BlogService";


@injectable()
export class BlogController {
    constructor(@inject(BlogService) private blogService: BlogService,

                ) {}

    getAllBlogsHandler = async (req: Request, res: Response) => {
        try {
            const query: BlogsQueryDTO = getQueryParams<Pick<BlogsQueryDTO, "searchNameTerm">>(req, {
                searchNameTerm: "string",
            });
            const blogs = await this.blogService.getAllBlogs(query);
            res.status(200).json(blogs);
        } catch (error) {
            console.error("Get all blogs error:", error);
            res.status(500).send("Internal server error");
        }
    }

    getBlogByIdHandler = async (req: Request, res: Response) => {
        try {
            const blog = await this.blogService.getBlogById(req.params.id);
            if (!blog) {
                res.status(404).send("Blog not found!");
                return;
            }
            res.status(200).json(blog);
        } catch (error) {
            console.error("Get blog by id error:", error);
            res.status(500).send("Internal server error");
        }
    }

    createBlogHandler = async (req: Request, res: Response) => {
        try {
            const {name, description, websiteUrl} = req.body;
            const dto = {name, description, websiteUrl};
            const blog = await this.blogService.createBlog(dto);
            if (!blog) {
                res.status(400).send("Blog not created");
                return;
            }
            res.status(201).json(blog);
        } catch (error) {
            console.error("Create blog error:", error);
            res.status(500).send("Internal server error");
        }
    };

    updateBlogHandler = async (req: Request, res: Response) => {
        try {
            const {name, description, websiteUrl} = req.body;
            const dto = {name, description, websiteUrl};
            const blogToUpdate = await this.blogService.updateBlogById(req.params.id, dto);
            if (!blogToUpdate) {
                res.status(404).send("Blog not found");
                return;
            }
            res.sendStatus(204);
        } catch (error) {
            console.error("Update blog error:", error);
            res.status(500).send("Internal server error");
        }
    };

    deleteBlogHandler = async (req: Request, res: Response) => {
        try {
            const blogToDelete = await this.blogService.deleteBlogById(req.params.id);
            if (!blogToDelete) {
                res.status(404).send("Blog not found");
                return;
            }
            res.sendStatus(204);
        } catch (error) {
            console.error("Delete blog error:", error);
            res.status(500).send("Internal server error");
        }
    };

    getAllPostsFromBlogHandler = async (req: Request, res: Response) => {
        try {
            const query: PostsQueryDTO = getQueryParams<PostsQueryDTO>(req);
            const posts = await this.blogService.getAllPostsFromBlog(req.params.id, query, req.user?.id);
            if (!posts) {
                res.status(404).send("Blog not found");
                return;
            }
            res.status(200).json(posts);
        } catch (error) {
            console.error("Get posts from blog error:", error);
            res.status(500).send("Internal server error");
        }
    };
    createPostForSpecialBlogHandler = async (req: Request, res: Response) => {
        try {
            const {title, shortDescription, content} = req.body;
            const dto = {title, shortDescription, content};
            const newPostToBlog = await this.blogService.createNewPostForSpecialBlog(req.params.id, dto);
            if (!newPostToBlog) {
                res.status(404).send("Blog not found!");
                return;
            }
            res.status(201).json(newPostToBlog);
        } catch (error) {
            console.error("Create post for blog error:", error);
            res.status(500).send("Internal server error");
        }
    }
}
