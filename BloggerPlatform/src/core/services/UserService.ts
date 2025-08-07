import {IUserRepository} from "../repository/IUserRepository";
import {User} from "../entities/User";
import {UserDTO} from "../repository/DTO/UserDTO";
import {v4 as uuidv4} from "uuid";


export class UserService {
    constructor(private readonly userRepository: IUserRepository) {}
    async getUserById(userId: string): Promise<User|null> {
        return await this.userRepository.getUserById(userId);
    }
    async createUser(dto:UserDTO): Promise<User> {
        const id = uuidv4();
        const newUser = new User(
            id,
            dto.login,
            dto.email,
            dto.password,
            new Date().toISOString(),
        )
        return await this.userRepository.createUser(newUser);
    }
    async deleteUser(userId: string): Promise<void> {
        const user = await this.userRepository.getUserById(userId);
        if (!user) {
            throw new Error(`User with id ${userId} not found`);
        }
        return await this.userRepository.deleteUser(userId);
    }
    async getAllUsers(): Promise<User[]> {
        return await this.userRepository.getAllUsers();
    }
}