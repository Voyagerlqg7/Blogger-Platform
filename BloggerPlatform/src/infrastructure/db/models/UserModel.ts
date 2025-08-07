import {ObjectId} from "mongodb";

export type UserDB = {
    _id: ObjectId,
    accountData: {
        login: string,
        email: string,
        passwordHash: string,
        passwordSalt: string,
        createdAt: Date
    },
    emailConfirmation: {
        confirmationCode: string,
        expiresAt: string,
        isConfirmed: boolean
    }
}
export type UserViewModel = {
    id: string;
    login: string;
    email: string;
    createdAt: Date;
}