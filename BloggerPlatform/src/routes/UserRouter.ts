import express from "express";
import {Request, Response, Router} from "express";
import {usersValidationMiddleware} from "../infrastructure/middlewares/UserValidation";
import {basicAuthMiddleware} from "../Authorization/BasicAuthMiddleware";
import {UserService} from "../Domain/UserService";
import {inputValidationMiddleware} from "../infrastructure/middlewares/input-validation-middleware";


export const UserRouter = Router();
export interface UserQueryParams {
    sortBy: string;
    sortDirection: 'asc' | 'desc';
    pageNumber: number;
    pageSize: number;
    searchLoginTerm: string;
    searchEmailTerm: string;
}
export interface NewUserTemplate {
    login: string;
    password: string;
    email: string;
}


UserRouter.get('/', basicAuthMiddleware, async (request: Request, response: Response) => {
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
    const users = await UserService.GetAllUsers(queryParams);
    response.status(200).send(users);
})
UserRouter.post('/', usersValidationMiddleware,basicAuthMiddleware, inputValidationMiddleware, async (request: Request, response: Response) => {
    const userLogin = request.body.login;
    const userPassword = request.body.password;
    const userEmail = request.body.email;

    const newUser:NewUserTemplate ={
        login: userLogin,
        password: userPassword,
        email: userEmail
    }

    const createdUser = await UserService.createUser(newUser);
    if(createdUser) {
        response.status(201).send(createdUser);
    }
    else{response.status(400).send();}
})
UserRouter.delete('/:id', basicAuthMiddleware, async (request: Request, response: Response) => {
    const userToDelete = await UserService.DeleteUserByID(request.params.id);
    if (userToDelete) {
        response.status(204).send();
    } else {
        response.status(404).send();
    }
})