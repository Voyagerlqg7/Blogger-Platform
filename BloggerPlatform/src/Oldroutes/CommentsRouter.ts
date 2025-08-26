import express, {Request, Response, Router} from "express";
import {commentsValidationMiddleware} from "../infrastructure/middlewares/CommentsValidation";
import {CommentsService} from "../Domain/CommentsService";
import {AuthMiddleware} from "../Authorization/AuthMiddleware";
import {inputValidationMiddleware} from "../infrastructure/middlewares/input-validation-middleware";


export const CommentRouter = Router();
CommentRouter.use(express.json());

CommentRouter.get('/:id', async (req: Request, res: Response)=> {
    const commentId = req.params.id;
    const comment = await CommentsService.GetCommentById(commentId);
    if (!comment) {
        res.status(404).send("No comment found");
    }
    else {
        res.status(200).send(comment);
    }
});
CommentRouter.put('/:commentId', AuthMiddleware, commentsValidationMiddleware,inputValidationMiddleware, async (req: Request, res: Response) => {
    const commentId = req.params.commentId;
    const text = req.body.content;
    const userId = req.user!.id;

    const updatedComment = await CommentsService.UpdateCommentById(commentId, text, userId);

    if (updatedComment === null) {
        res.status(404).send("Comment not found");
        return;
    }

    if (updatedComment === false) {
        res.status(403).send("Forbidden");
        return;
    }

    res.status(204).send();
});

CommentRouter.delete('/:commentId', AuthMiddleware, async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const commentId = req.params.commentId;
    const result = await CommentsService.DeleteCommentById(commentId, userId);

    if (result === null) {
        res.status(404).send("Comment not found");
        return;
    }

    if (result === false) {
        res.status(403).send("Forbidden");
        return;
    }

    res.status(204).send();
});


