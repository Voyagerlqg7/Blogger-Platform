import express, {Request, Response, Router} from "express";
import {commentsValidationMiddleware} from "../Validator/CommentsValidation";


export const CommentRouter = Router();
CommentRouter.use(express.json());

CommentRouter.get('/', async (req: Request, res: Response) => {

});
CommentRouter.put('/:commentId',commentsValidationMiddleware, async (req: Request, res: Response) => {

})
CommentRouter.delete('/:commentId', async (req: Request, res: Response) => {

})