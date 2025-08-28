import {User} from "../entities/User";
import {UsersQueryDTO} from "./DTO/QueryParamsDTO";

export interface IUserRepository {
    createUser(user:User): Promise<User>;
    getAllUsers(Q_params:UsersQueryDTO): Promise<User[]>;
    deleteUser(userId: string): Promise<void>;
    getUserById(userId: string): Promise<User|null>;
    findByLoginOrEmail(loginOrEmail:string): Promise<User|null>;
    updateStatusConfirmation(user:User):Promise<void>;
    updateCodeConfirmationAndExpiresTime(userId:string, newCode:string,newExpiresAt:string): Promise<void>
    getPasswordHash(loginOrEmail:string):Promise<string|null>;
    findByCodeConfirmation(codeConfirmation: string): Promise<User|null>;
}