import {body, validationResult} from "express-validator";
import {query} from 'express-validator';

export const blogValidationMiddleware = [
    body('name').isString().isLength({ max: 15 }).withMessage('Name must be a string with a maximum length of 15'),
    body('description').isString().isLength({ max: 500 }).withMessage('Description must be a string with a maximum length of 500'),
    body('websiteUrl').isString().isURL().isLength({ max: 100 }).withMessage('WebsiteUrl must be a valid URL with a maximum length of 100'),
];