import { body, ValidationChain } from "express-validator";

export const postValidationMiddleware: ValidationChain[] = [
    body('title')
        .isString()
        .withMessage('Title must be a string')
        .isLength({ max: 30 })
        .withMessage('Title must be no longer than 30 characters')
        .onlyFirstError(),
    body('shortDescription')
        .isString()
        .withMessage('Short description must be a string')
        .onlyFirstError(),
    body('content')
        .isString()
        .withMessage('Content must be a string')
        .onlyFirstError(),
    body('blogId')
        .isString()
        .withMessage('BlogId must be a string')
        .onlyFirstError(),
];