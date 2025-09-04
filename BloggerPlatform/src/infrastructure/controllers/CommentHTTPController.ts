import {Request, Response} from 'express';
import {commentService} from "../composition";

export const getCommentById = async (req: Request, res: Response): Promise<void> => {
    try {
        const comment = await commentService.getCommentById(req.params.id);
        if (!comment) {
            res.status(404).send('No comment found.');
            return;
        }
        res.status(200).json(comment);
    } catch (error) {
        console.error('Get comment by id error:', error);
        res.status(500).send("Internal server error");
    }
};

export const updateComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const {content} = req.body;
        const comment = await commentService.getCommentById(req.params.id);
        if (!comment) {
            res.status(404).send('No comment found.');
            return;
        }
        const result = await commentService.updateCommentById(req.params.id, content, req.user!.id);
        if (result === false) {
            res.status(403).send('Its not your comment (update)');
            return;
        }
        res.status(204).send();
    } catch (error) {
        console.error('Update comment error:', error);
        res.status(500).send("Internal server error");
    }
};

export const deleteCommentById = async (req: Request, res: Response): Promise<void> => {
    try {
        const comment = await commentService.getCommentById(req.params.id);
        if (!comment) {
            res.status(404).send('No comment found.');
            return;
        }
        const result = await commentService.deleteCommentById(req.params.id, req.user!.id);
        if (result === false) {
            res.status(403).send('Its not your comment (delete)');
            return;
        }
        res.status(204).send();
    } catch (error) {
        console.error('Delete comment error:', error);
        res.status(500).send("Internal server error");
    }
};
