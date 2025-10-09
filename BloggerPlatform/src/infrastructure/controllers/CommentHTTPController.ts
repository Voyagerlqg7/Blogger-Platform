import {Request, Response} from 'express';
import {injectable, inject} from "inversify";
import {CommentService} from "../../core/services/CommentService";

@injectable()
export class CommentController {
    constructor(@inject(CommentService)private commentService: CommentService) {}
    getCommentById = async (req: Request, res: Response): Promise<void> => {
        try {
            const comment = await this.commentService.getCommentById(req.params.id);
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
    updateComment = async (req: Request, res: Response): Promise<void> => {
        try {
            const {content} = req.body;
            const comment = await this.commentService.getCommentById(req.params.id);
            if (!comment) {
                res.status(404).send('No comment found.');
                return;
            }
            const result = await this.commentService.updateCommentById(req.params.id, content, req.user!.id);
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
    deleteCommentById = async (req: Request, res: Response): Promise<void> => {
        try {
            const comment = await this.commentService.getCommentById(req.params.id);
            if (!comment) {
                res.status(404).send('No comment found.');
                return;
            }
            const result = await this.commentService.deleteCommentById(req.params.id, req.user!.id);
            if (result === false) {
                res.status(403).send('Its not your comment (delete)');
                return;
            }
            res.status(204).send();
        } catch (error) {
            console.error('Delete comment error:', error);
            res.status(500).send("Internal server error");
        }
    }
    RateComment = async (req: Request, res: Response): Promise<void> => {

    }
}
