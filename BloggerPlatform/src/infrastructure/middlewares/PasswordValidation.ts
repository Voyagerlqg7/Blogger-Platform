import { body, ValidationChain } from "express-validator";


export const resetPasswordMiddleware = ():ValidationChain[] => [
    body('newPassword')
        .isLength({ min: 6, max: 20 })
        .withMessage('Password must be between 6 and 20 characters')
        .notEmpty()
        .withMessage('Password is required'),
    body('recoveryCode')
        .isUUID()
        .withMessage('Recovery code must be a valid UUID')
        .notEmpty()
        .withMessage('Recovery code is required')
];