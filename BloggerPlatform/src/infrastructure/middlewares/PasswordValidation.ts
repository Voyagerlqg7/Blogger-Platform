import { body, ValidationChain } from "express-validator";


export const resetPasswordMiddleware = (): ValidationChain[] => {
    return[
        body('password')
            .trim()
            .notEmpty().withMessage('Password is required')
            .isString().withMessage('Password must be a string')
            .isLength({ min: 6, max: 20 }).withMessage('Password must be between 6 and 20 characters'),
    ]
}