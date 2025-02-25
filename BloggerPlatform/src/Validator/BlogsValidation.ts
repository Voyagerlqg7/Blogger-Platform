import {body, ValidationChain} from "express-validator";

export const blogValidationMiddleware: ValidationChain[] = [
    body('name')
        .isString()
        .withMessage('Name must be a string')
        .trim()
        .notEmpty()
        .isLength({ max: 15 })
        .withMessage('Name must be no longer than 15 characters'),
    body('description')
        .isString()
        .withMessage('Description must be a string')
        .trim()
        .notEmpty()
        .isLength({ max: 500 })
        .withMessage('Description must be no longer than 500 characters'),
    body('websiteUrl')
        .isString()
        .withMessage('WebsiteUrl must be a string')
        .isURL()
        .trim()
        .notEmpty()
        .withMessage('WebsiteUrl must be a valid URL')
        .isLength({ max: 100 })
        .withMessage('WebsiteUrl must be no longer than 100 characters'),
];
