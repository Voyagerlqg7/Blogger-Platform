import {postService} from "../composition";
import {RequestHandler} from "express";
import {PostsQueryDTO} from "../../core/repository/DTO/QueryParamsDTO";
import {getQueryParams} from "../helpers/queryHelper";

export const getAllPosts: RequestHandler = async (req, res) => {
    try {
        const query: PostsQueryDTO = getQueryParams<PostsQueryDTO>(req);
        const posts = await postService.getAllPosts(query);
        res.status(200).json(posts);
    } catch (error) {
        console.error('Get all posts error:', error);
        res.status(500).send("Internal server error");
    }
};

export const getPostById: RequestHandler = async (req, res) => {
    try {
        const post = await postService.getPostById(req.params.id);
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

export const createPost: RequestHandler = async (req, res) => {
    try {
        const {title, shortDescription, content, blogId} = req.body;
        const dto = {title, shortDescription, content, blogId};
        const post = await postService.createPost(dto);
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

export const updatePostById: RequestHandler = async (req, res) => {
    try {
        const postToUpdate = await postService.getPostById(req.params.id);
        if (!postToUpdate) {
            res.status(404).send({error: "Post not found"});
            return;
        }
        const {title, shortDescription, content, blogId} = req.body;
        const dto = {title, shortDescription, content, blogId};
        await postService.updatePostById(req.params.id, dto);
        res.status(204).send();
    } catch (error) {
        console.error('Update post error:', error);
        res.status(500).send("Internal server error");
    }
};

export const getAllCommentsByPostId: RequestHandler = async (req, res) => {
    try {
        const query: PostsQueryDTO = getQueryParams<PostsQueryDTO>(req);
        const comments = await postService.getAllCommentsFromPost(req.params.id, query);

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

export const createCommentByPostId: RequestHandler = async (req, res) => {
    try {
        const post = await postService.getPostById(req.params.id);
        if (!post) {
            res.status(404).send("Post not found");
            return;
        }
        const comment = await postService.createCommentUnderPost(
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

export const deletePostById: RequestHandler = async (req, res) => {
    try {
        const post = await postService.getPostById(req.params.id);
        if (!post) {
            res.status(404).send("Post not found");
            return;
        }
        await postService.deletePostById(req.params.id);
        res.status(204).send();
    } catch (error) {
        console.error('Delete post error:', error);
        res.status(500).send("Internal server error");
    }
};
