import express, {Request, Response, Router} from "express";
import {commentsValidationMiddleware} from "../Validator/CommentsValidation";
import {CommentDB} from "../Objects/Comments";
import {CommentsService} from "../Domain/CommentsService";


export const CommentRouter = Router();
CommentRouter.use(express.json());

CommentRouter.get('/:id', async (req: Request, res: Response):Promise<CommentDB | undefined> => {
    const commentId = req.params.id;
    const comment = await CommentsService.GetCommentById(commentId);
    if (!comment) {
        res.status(404).send("No comment found");
    }
    else{
        res.status(200).send(comment);
    }
});
CommentRouter.put('/:commentId',commentsValidationMiddleware, async (req: Request, res: Response) => {

})
CommentRouter.delete('/:commentId', async (req: Request, res: Response) => {

})