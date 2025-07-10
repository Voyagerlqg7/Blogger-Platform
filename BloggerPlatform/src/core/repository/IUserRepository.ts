import {User} from "../entities/User";
import {UserDTO} from "./DTO/UserDTO";
export interface IUserRepository {
    createUser(dto:UserDTO): User;
    getAllUsers(): User;
    deleteUser(userId: string): void;
}