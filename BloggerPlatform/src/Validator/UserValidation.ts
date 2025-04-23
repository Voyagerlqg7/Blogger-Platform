import {body, ValidationChain} from "express-validator";
import {client} from "../mongo/ConnectDB";
import {ObjectId} from "mongodb";

//const UsersDBCollection = client.db("BloggerPlatform").collection("users");

export const usersValidationMiddleware : ValidationChain[] = [
    body('login')
        .isString()
        .withMessage('Username is required')
        .bail()
        .isLength({ min: 3, max: 10 })
        .withMessage('Login must be no longer than 30 and no less tha 3 characters')
        .trim()
        .notEmpty()
        .withMessage('login is required'),
    body('password')
        .isString()
        .withMessage('password is required')
        .bail()
        .isLength({ min: 6, max: 20 })
        .withMessage('password must be no longer than 20 and no less tha 6 characters')
        .trim()
        .notEmpty()
        .withMessage('password is required'),





    //must be unique!!!!!!!!!!!!!!

    body('email')
        .isString()
        .withMessage('email is required')
        .bail()
        .isEmail()
        .withMessage('email is required')
        .trim()
        .notEmpty()
        .withMessage('email is required'),
]