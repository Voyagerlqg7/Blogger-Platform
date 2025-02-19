import {Request, Response, Router} from 'express';
import {blogs} from "../DataB/Blogs";
export const BlogsRouter = Router();

BlogsRouter.get('/', async (request: Request, response: Response) => {
    response.status(200).send(blogs);
})
BlogsRouter.get('/:id', async (request: Request, response: Response) => {

})
BlogsRouter.post('/', async (request: Request, response: Response) => {

})
BlogsRouter.put('/', async (request: Request, response: Response) => {

})
BlogsRouter.delete('/', async (request: Request, response: Response) => {

})