import { body, validationResult } from "express-validator";

export const blogValidationMiddleware = [
    body('name')
        .isString()
        .withMessage('Name must be a string')
        .isLength({ max: 15 })
        .withMessage('Name must be no longer than 15 characters'),
    body('description')
        .isString()
        .withMessage('Description must be a string')
        .isLength({ max: 500 })
        .withMessage('Description must be no longer than 500 characters'),
    body('websiteUrl')
        .isString()
        .withMessage('WebsiteUrl must be a string')
        .isURL()
        .withMessage('WebsiteUrl must be a valid URL')
        .isLength({ max: 100 })
        .withMessage('WebsiteUrl must be no longer than 100 characters'),
];
