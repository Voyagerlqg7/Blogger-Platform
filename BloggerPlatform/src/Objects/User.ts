import {ObjectId} from "mongodb";

export type UserViewModel ={
    id: string,
    login: string,
    email: string,
    createdAt: string;
};
export type UsersPage = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: UserViewModel[];
};
export type UserDBType = {
    _id: ObjectId,
    accountData: {
        login: string,
        email: string,
        passwordHash: string,
        passwordSalt: string,
        createdAt: string
    },
    emailConfirmation: {
        confirmationCode: string,
        expiresAt: string,
        isConfirmed: boolean
    }
}