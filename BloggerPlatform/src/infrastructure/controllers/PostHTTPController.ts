import {postService} from "../composition";
import {Request, Response} from "express";

export const getAllPosts = async (req: Request, res: Response) => {
    const posts = await postService.getAllPosts();
    res.status(200).send(posts);
}

export const getPostById = async (req:Request, res:Response) => {
    const post = await postService.getPostById(req.params.id);
}

export const createPost = async (req: Request, res: Response) => {
    const {title, shortDescription, content, blogId}= req.body;
    const dto = {title, shortDescription, content, blogId};
    const post = await postService.createPost(dto);
    if (!post){res.status(404).send({error:"Probably blog doesnt exist"})}
    else {res.status(201).send(post)}
}

export const updatePostById = async (req: Request, res: Response) => {
    const {title, shortDescription, content, blogId}= req.body;
    const dto = {title, shortDescription, content, blogId};
    const postToUpdate = postService.getPostById(req.params.id);
    await postService.updatePostById(req.params.id,dto);
    if(!postToUpdate){res.status(404).send({error:"Probably blog doesnt exist"})}
    else {await postService.updatePostById(req.params.id,dto);}
}

export const getAllCommentsByPostId = async (req:Request, res:Response) => {
    const comments = await postService.getAllCommentsFromPost(req.params.id);
    if(!comments){res.status(404).send()}
    else{res.status(200).send(comments);}
}

export const createCommentByPostId = async (req:Request, res:Response) => {
    const post = postService.getPostById(req.params.id);
    if(!post){res.status(404).send("Post not found")}
    else{
        //const comment = await postService.createCommentUnderPost(req.params.id,req.body.content)
        //res.status(201).send(comment);
    }
}

export const deletePostById = async (req:Request, res:Response) => {
    const post = postService.getPostById(req.params.id);
    if(!post){res.status(404).send("Post not found")}
    else{
        await postService.deletePostById(req.params.id);
        res.status(204).send();
    }
}