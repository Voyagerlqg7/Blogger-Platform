import express = require('express');


export const UserRouter = express.Router();

UserRouter.use(express.json());
UserRouter.get('/', (req: express.Request, res: express.Response) => {

})
UserRouter.post('/', (req: express.Request, res: express.Response) => {

})
UserRouter.delete('/:id', (req: express.Request, res: express.Response) => {

})