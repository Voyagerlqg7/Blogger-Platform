import express, {Request, Response, Router} from "express";
import {commentsValidationMiddleware} from "../Validator/CommentsValidation";
import {CommentsService} from "../Domain/CommentsService";
import {AuthMiddleware} from "../Authorization/AuthMiddleware";


export const CommentRouter = Router();
CommentRouter.use(express.json());

CommentRouter.get('/:id', AuthMiddleware, async (req: Request, res: Response)=> {
    const commentId = req.params.id;
    const comment = await CommentsService.GetCommentById(commentId);
    if (!comment) {
        res.status(404).send("No comment found");
    }
    res.status(200).send(comment);
});
CommentRouter.put('/:commentId',AuthMiddleware,commentsValidationMiddleware, async (req: Request, res: Response) => {
    const commentId = req.params.id;
    const text = req.body.content;
    const UpdatedComment = await CommentsService.UpdateCommentById(commentId,text);
    if (!UpdatedComment) {
        res.status(404).send("No comment found");
    }
    else{
        res.status(200).send(UpdatedComment);
    }
})
CommentRouter.delete('/:commentId', AuthMiddleware, commentsValidationMiddleware,async (req: Request, res: Response) => {
    const result = await CommentsService.DeleteCommentById(req.params.commentId);
    if(!result){
        res.status(404).send("No comment found");
    }
    else{
        res.status(200).send(result);
    }
})