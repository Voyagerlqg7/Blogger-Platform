import {body, ValidationChain} from "express-validator";

export const usersValidationMiddleware: ValidationChain[] = [
    body('login')
        .trim()
        .notEmpty().withMessage('Login is required')
        .isString().withMessage('Login must be a string')
        .isLength({ min: 3, max: 10 }).withMessage('Login must be between 3 and 10 characters'),

    body('password')
        .trim()
        .notEmpty().withMessage('Password is required')
        .isString().withMessage('Password must be a string')
        .isLength({ min: 6, max: 20 }).withMessage('Password must be between 6 and 20 characters'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Email must be valid'),
];
