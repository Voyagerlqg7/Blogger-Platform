import { body, ValidationChain } from "express-validator";

export const postValidationMiddleware: ValidationChain[] = [
    body('title')
        .isString()
        .withMessage('Title must be a string')
        .isLength({ max: 30 })
        .trim()
        .withMessage('Title must be no longer than 30 characters'),
    body('shortDescription')
        .isString()
        .trim()
        .withMessage('Short description must be a string'),
    body('content')
        .isString()
        .trim()
        .withMessage('Content must be a string'),
    body('blogId')
        .isString()
        .trim()
        .withMessage('BlogId must be a string'),
];