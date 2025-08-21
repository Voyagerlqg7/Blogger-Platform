import {IUserRepository} from "../repository/IUserRepository";
import {User} from "../entities/User";
import {UserDTO} from "../repository/DTO/UserDTO";
import {v4 as uuidv4} from "uuid";
import { add } from "date-fns";


export class UserService {
    constructor(private readonly userRepository: IUserRepository) {}
    async getUserById(userId: string): Promise<User|null> {
        return await this.userRepository.getUserById(userId);
    }
    async createUser(dto: UserDTO): Promise<User> {
        const id = uuidv4();
        const code = uuidv4();
        const expiresAt = add(new Date(), { seconds: 30 }).toISOString();

        const newUser = new User(
            id,
            dto.login,
            dto.email,
            dto.password,
            new Date().toISOString(),
            code,
            expiresAt,
            false
        );
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
    async findByLoginOrEmail(loginOrEmail:string): Promise<User|null>{
        return await this.userRepository.findByLoginOrEmail(loginOrEmail);
    }
    async updateStatusConfirmation(user:User):Promise<void>{
        return await this.userRepository.updateStatusConfirmation(user);
    }
    async updateCodeConfirmationAndExpiresTime(userId:string, newCode:string,newExpiresAt:string): Promise<void>{
        return await this.userRepository.updateCodeConfirmationAndExpiresTime(userId,newCode,newExpiresAt);
    }
}