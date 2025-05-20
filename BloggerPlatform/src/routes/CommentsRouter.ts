import express, {Request, Response, Router} from "express";


export const CommentRouter = Router();

CommentRouter.use(express.json());
CommentRouter.get('/', (req: Request, res: Response) => {

});
CommentRouter.put('/:commentId', (req: Request, res: Response) => {

})
CommentRouter.delete('/:commentId', (req: Request, res: Response) => {

})