import { body, ValidationChain } from "express-validator";

export const postValidationMiddleware: ValidationChain[] = [
    body('title')
        .isString()
        .withMessage('Title must be a string')
        .bail()
        .isLength({ max: 30 })
        .withMessage('Title must be no longer than 30 characters')
        .trim()
        .notEmpty()
        .withMessage('Title is required'),

    body('shortDescription')
        .isString()
        .withMessage('Short description must be a string')
        .bail()
        .trim()
        .isLength({ max: 100 })
        .notEmpty()
        .withMessage('Short description is required'),

    body('content')
        .isString()
        .withMessage('Content must be a string')
        .bail()
        .trim()
        .isLength({ max: 1000 })
        .notEmpty()
        .withMessage('Content is required'),
];
