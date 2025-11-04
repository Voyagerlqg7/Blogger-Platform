import {Request, Response} from "express";
import {RequestHandler} from "express";
import {PostsQueryDTO} from "../../core/repository/DTO/QueryParamsDTO";
import {getQueryParams} from "../helpers/queryHelper";
import{injectable, inject} from "inversify";
import {PostService} from "../../core/services/PostService";

@injectable()
export class PostHTTPController {
    constructor(@inject(PostService) private postService: PostService) {
    }

    getAllPosts: RequestHandler = async (req, res) => {
        try {
            const userId = req.user?.id
            const query: PostsQueryDTO = getQueryParams<PostsQueryDTO>(req);
            const posts = await this.postService.getAllPosts(query,userId);
            res.status(200).json(posts);
        } catch (error) {
            console.error('Get all posts error:', error);
            res.status(500).send("Internal server error");
        }
    };
    getPostById: RequestHandler = async (req, res) => {
        try {
            const userId = req.user?.id;
            const post = await this.postService.getPostById(req.params.id, userId);
            if (!post) {
                res.status(404).send("Post not found");
                return;
            }
            res.status(200).json(post);
        } catch (error) {
            console.error('Get post by id error:', error);
            res.status(500).send("Internal server error");
        }
    };
    createPost: RequestHandler = async (req, res) => {
        try {
            const {title, shortDescription, content, blogId} = req.body;
            const dto = {title, shortDescription, content, blogId};
            const post = await this.postService.createPost(dto);
            if (!post) {
                res.status(404).send({error: "Blog doesn't exist"});
                return;
            }
            res.status(201).json(post);
        } catch (error) {
            console.error('Create post error:', error);
            res.status(500).send("Internal server error");
        }
    };
    updatePostById: RequestHandler = async (req, res) => {
        try {
            const postToUpdate = await this.postService.getPostById(req.params.id);
            if (!postToUpdate) {
                res.status(404).send({error: "Post not found"});
                return;
            }
            const {title, shortDescription, content, blogId} = req.body;
            const dto = {title, shortDescription, content, blogId};
            await this.postService.updatePostById(req.params.id, dto);
            res.status(204).send();
        } catch (error) {
            console.error('Update post error:', error);
            res.status(500).send("Internal server error");
        }
    };
    getAllCommentsByPostId: RequestHandler = async (req, res) => {
        try {
            const query: PostsQueryDTO = getQueryParams<PostsQueryDTO>(req);
            const userId = req.user?.id;
            const comments = await this.postService.getAllCommentsFromPost(req.params.id, query,userId);

            if (!comments) {
                res.status(404).send("Post not found");
                return;
            }
            res.status(200).json(comments);
        } catch (error) {
            console.error('Get comments by post id error:', error);
            res.status(500).send("Internal server error");
        }
    };
    createCommentByPostId: RequestHandler = async (req, res) => {
        try {
            const post = await this.postService.getPostById(req.params.id);
            if (!post) {
                res.status(404).send("Post not found");
                return;
            }
            const comment = await this.postService.createCommentUnderPost(
                req.params.id,
                req.body.content,
                req.user!.id,
                req.user!.login
            );
            res.status(201).json(comment);
        } catch (error) {
            console.error('Create comment error:', error);
            res.status(500).send("Internal server error");
        }
    };
    deletePostById: RequestHandler = async (req, res) => {
        try {
            const post = await this.postService.getPostById(req.params.id);
            if (!post) {
                res.status(404).send("Post not found");
                return;
            }
            await this.postService.deletePostById(req.params.id);
            res.status(204).send();
        } catch (error) {
            console.error('Delete post error:', error);
            res.status(500).send("Internal server error");
        }
    };

    RatePost = async (req: Request, res: Response): Promise<void> => {
        try {
            const { likeStatus } = req.body;
            const postId = req.params.id;
            const userId = req.user!.id;
            const login = req.user!.login;
            const post = await this.postService.getPostById(postId);
            if (!post) {
                res.status(404).send('Post not found.');
                return;
            }

            await this.postService.ratePostById(userId, postId, login, likeStatus);
            res.status(204).send();
        } catch (error) {
            console.error('Rate post error:', error);
            res.status(500).send("Internal server error");
        }
    };

}
