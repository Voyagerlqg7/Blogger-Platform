import {User} from "../entities/User";
import {UserDTO} from "./DTO/UserDTO";

export interface IUserRepository {
    createUser(user:User): Promise<User>;
    getAllUsers(): Promise<User[]>;
    deleteUser(userId: string): Promise<void>;
    getUserById(userId: string): Promise<User|null>;
    findByLoginOrEmail(loginOrEmail:string): Promise<User|null>;
    updateStatusConfirmation(user:User):Promise<void>;
    updateCodeConfirmationAndExpiresTime(userId:string, newCode:string,newExpiresAt:string): Promise<void>
}