import {User} from "../entities/User";

export interface IUserRepository {
    createUser(login: string, password:string, email:string): User;
    getAllUsers(): User;
    deleteUser(id: string): void;
}