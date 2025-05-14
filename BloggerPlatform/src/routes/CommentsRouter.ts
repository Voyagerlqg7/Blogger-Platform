import express, {Request, Response, Router} from "express";


export const CommentRouter = Router();

CommentRouter.use(express.json());
CommentRouter.get('/', (req: Request, res: Response) => {

});
CommentRouter.put('/', (req: Request, res: Response) => {

})
CommentRouter.delete('/:id', (req: Request, res: Response) => {

})