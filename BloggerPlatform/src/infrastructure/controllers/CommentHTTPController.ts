import {Request, Response} from 'express';
import {commentService} from "../composition";

export const getCommentById = async (req:Request, res: Response)=> {
    const comment = await commentService.getCommentById(req.params.id);
    if (!comment) {res.status(404).send('No comment found.');}
    else{res.status(200).send(comment);}
}

export const updateComment = async (req:Request, res: Response) => {
    const {content} = req.body;
    const comment = await commentService.getCommentById(req.params.id);
    if (!comment) {res.status(404).send('No comment found.');}
    else {
        await commentService.updateCommentById(req.params.id, content);
        res.status(204).send();
    }
}

export const deleteCommentById = async (req:Request, res: Response) => {
 const comment = await commentService.getCommentById(req.params.id);
 if(!comment){res.status(404).send('No comment found.');}
 else {
     await commentService.deleteCommentById(req.params.id);
    res.status(204).send();
 }
}