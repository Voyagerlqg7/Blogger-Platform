import express = require('express');
import {usersValidationMiddleware} from "../Validator/UserValidation";


export const UserRouter = express.Router();
UserRouter.use(express.json());
export interface UserQueryParams {
    sortBy: string;
    sortDirection: 'asc' | 'desc';
    pageNumber: number;
    pageSize: number;
    searchLoginTerm: string;
    searchEmailTerm: string;
}

UserRouter.get('/', (request: express.Request, response: express.Response) => {
    const sortBy = request.query.sortBy as string || 'createdAt';
    const sortDirection = (request.query.sortDirection === 'asc' || request.query.sortDirection === 'desc')
        ? request.query.sortDirection
        : 'desc';
    const pageNumber = parseInt(request.query.pageNumber as string) || 1;
    const pageSize = parseInt(request.query.pageSize as string) || 10;
    const searchLoginTerm = request.query.searchLoginTerm as string || null;
    const searchEmailTerm = request.query.searchEmailTerm as string || null;

    const queryParams:UserQueryParams = {
        sortBy,
        sortDirection: sortDirection as 'asc' | 'desc',
        pageNumber,
        pageSize,
        searchLoginTerm: searchLoginTerm as string,
        searchEmailTerm: searchEmailTerm as string,
    }


})
UserRouter.post('/', usersValidationMiddleware,(req: express.Request, res: express.Response) => {

})
UserRouter.delete('/:id', (req: express.Request, res: express.Response) => {

})