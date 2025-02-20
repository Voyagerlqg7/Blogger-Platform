import {body, validationResult} from "express-validator";
import {query} from 'express-validator';

export const postValidationMiddleware = [
    body('title').isString().isLength({ max: 30 }).withMessage('Title must be a string with a maximum length of 30'),
    body('shortDescription').isString().isLength({ max: 100 }).withMessage('shortDescription must be a string with a maximum length of 100'),
    body('content').isString().isURL().isLength({ max: 1000 }).withMessage('content must be a valid URL with a maximum length of 1000'),
];