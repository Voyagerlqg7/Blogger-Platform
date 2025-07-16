import {User} from "../entities/User";
import {UserDTO} from "./DTO/UserDTO";
export interface IUserRepository {
    createUser(dto:UserDTO): Promise<User>;
    getAllUsers(): Promise<User[]>;
    deleteUser(userId: string): Promise<void>;
}