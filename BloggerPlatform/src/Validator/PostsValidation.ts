import { body, validationResult } from "express-validator";

export const postValidationMiddleware = [
    body('title')
        .isString()
        .withMessage('Title must be a string')
        .isLength({ max: 30 })
        .withMessage('Title must be no longer than 30 characters'),

    body('shortDescription')
        .isString()
        .withMessage('Short description must be a string')
        .isLength({ max: 100 })
        .withMessage('Short description must be no longer than 100 characters'),

    body('content')
        .isString()
        .withMessage('Content must be a string')
        .isLength({ max: 1000 })
        .withMessage('Content must be no longer than 1000 characters'),

    body('blogId')
        .isString()
        .withMessage('Blog ID must be a string')
        .custom((value) => {
            return true;
        })
        .withMessage('Invalid blog ID'),
];