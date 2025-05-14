import express, {Request, Response, Router} from "express";


export const FeedBackRouter = Router();

FeedBackRouter.use(express.json());
FeedBackRouter.get('/', (req: Request, res: Response) => {

});
FeedBackRouter.put('/', (req: Request, res: Response) => {

})
FeedBackRouter.delete('/:id', (req: Request, res: Response) => {

})