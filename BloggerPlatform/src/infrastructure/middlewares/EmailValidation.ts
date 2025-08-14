import { body } from "express-validator";

export const emailResendingValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Email must be valid'),
];
