import { body, ValidationChain } from "express-validator";
import {blogs} from "../DataB/Blogs"

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
    body('blogId')
        .isString()
        .withMessage('BlogId must be a string')
        .bail()
        .trim()
        .notEmpty()
        .withMessage('BlogId is required')
        .custom((value) => {
            const blogExists = blogs.some(blog => blog.id === value);
            if (!blogExists) {
                throw new Error('BlogId does not exist');
            }
            return true;
        }),
];
