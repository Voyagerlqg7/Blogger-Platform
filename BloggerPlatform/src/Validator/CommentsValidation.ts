import { body, ValidationChain } from "express-validator";

export const commentsValidationMiddleware: ValidationChain[] = [
body("content")
    .isString()
    .withMessage('Comment must be a string')
    .bail()
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .bail()
    .isLength({ max: 300, min:20 })
    .withMessage('Name must be no longer than 300 characters or bigger than 20')
];