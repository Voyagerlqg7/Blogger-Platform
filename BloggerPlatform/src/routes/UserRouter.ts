import express = require("express");
import {Request, Response, Router} from "express";
import {usersValidationMiddleware} from "../Validator/UserValidation";
import {authMiddleware} from "../BasicAuthorization/authMiddleware";
import {UserService} from "../Domain/UserService";


export const UserRouter = Router();
UserRouter.use(express.json());
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


UserRouter.get('/', authMiddleware, async (request: Request, response: Response) => {
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
UserRouter.post('/', usersValidationMiddleware,authMiddleware, async (request: express.Request, response: express.Response) => {
    const userLogin = request.body.userLogin;
    const userPassword = request.body.userPassword;
    const userEmail = request.body.userEmail;

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
UserRouter.delete('/:id', authMiddleware, async (request: Request, response: Response) => {
    const userToDelete = await UserService.DeleteUserByID(request.params.id);
    if (userToDelete) {
        response.status(204).send();
    } else {
        response.status(404).send();
    }
})