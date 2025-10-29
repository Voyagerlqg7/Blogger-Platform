import { body } from 'express-validator';

export const likeStatusValidation = [
    body('likeStatus')
        .isIn(['Like', 'Dislike', 'None'])
        .withMessage('Like status must be one of: Like, Dislike, None'),
];