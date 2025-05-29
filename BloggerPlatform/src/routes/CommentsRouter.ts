import express, {Request, Response, Router} from "express";
import {commentsValidationMiddleware} from "../Validator/CommentsValidation";
import {CommentsService} from "../Domain/CommentsService";
import {AuthMiddleware} from "../Authorization/AuthMiddleware";
import {inputValidationMiddleware} from "../Validator/input-validation-middleware";


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
    const userId = req.user!._id;

    const updatedComment = await CommentsService.UpdateCommentById(commentId, text, userId);

    if (!updatedComment) {
        res.status(404).send("Forbidden or comment not found"); // 403 — доступ запрещён
    }
    else{
        res.status(204).send(updatedComment);
    }
});

CommentRouter.delete('/:commentId', AuthMiddleware, async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!._id;
    const commentId = req.params.commentId;
    const result = await CommentsService.DeleteCommentById(commentId, userId);

    if (result === null) {
        res.status(404).send("Comment not found"); // 🟡 комментария нет
        return;
    }

    if (result === false) {
        res.status(403).send("Forbidden"); // 🔴 чужой комментарий
        return;
    }

    res.status(204).send(); // 🟢 удалён успешно
});


