import {ObjectId} from "mongodb";

export type User ={
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
    items: User[];
};

export type UserDBType ={
    _id: ObjectId,
    login: string,
    email: string,
    passwordHash: string,
    passwordSalt: string;
    createdAt: string;
}