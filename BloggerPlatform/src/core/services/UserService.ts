import {IUserRepository} from "../repository/IUserRepository";
import {User, UserViewModel} from "../entities/User";
import {UserDTO} from "../repository/DTO/UserDTO";
import {v4 as uuidv4} from "uuid";
import { add } from "date-fns";
import {PagedResponse, UsersQueryDTO} from "../repository/DTO/QueryParamsDTO";
import { injectable, inject } from "inversify";

@injectable()
export class UserService {
    constructor(
        @inject("IUserRepository") private userRepository: IUserRepository
    ) {}

    async getUserById(userId: string): Promise<User|null> {
        return await this.userRepository.getUserById(userId);
    }
    async createUser(dto: UserDTO): Promise<UserViewModel> {
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
            true //USER CREATED BY ADMIN AND ALREADY CONFIRMED
        );
        return await this.userRepository.createUser(newUser);
    }


    async registrationUser(dto: UserDTO): Promise<UserViewModel> {
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
        return await this.userRepository.registrationUser(newUser);
    }
    async deleteUser(userId: string): Promise<void> {
        const user = await this.userRepository.getUserById(userId);
        if (!user) {
            throw new Error(`User with id ${userId} not found`);
        }
        return await this.userRepository.deleteUser(userId);
    }
    async getAllUsers(query: UsersQueryDTO): Promise<PagedResponse<User>> {
        return await this.userRepository.getAllUsers(query);
    }
    async findByLoginOrEmail(loginOrEmail:string): Promise<User|null>{
        return await this.userRepository.findByLoginOrEmail(loginOrEmail);
    }
    async getPasswordHash(loginOrEmail:string): Promise<string|null>{
        return await this.userRepository.getPasswordHash(loginOrEmail);
    }
    async updateStatusConfirmation(user:User):Promise<void>{
        return await this.userRepository.updateStatusConfirmation(user);
    }
    async findByCodeConfirmation(codeConfirmation: string): Promise<User> {
        const user = await this.userRepository.findByCodeConfirmation(codeConfirmation);
        if (!user) {
            throw new Error(`Cannot find user with code confirmation: ${codeConfirmation}`);
        }
        return user;
    }
    async findUserByRecoverPasswordCode(code:string): Promise<User> {
        const user = await this.userRepository.findByRecoverPasswordCode(code);
        if (!user) {
            throw new Error(`Cannot find user with recover code: ${code}`);
        }
        return user;
    }
    async updateCodeConfirmationAndExpiresTime(userId:string, newCode:string,newExpiresAt:string): Promise<void>{
        return await this.userRepository.updateCodeConfirmationAndExpiresTime(userId,newCode,newExpiresAt);
    }
    async updateRecoverPasswordCodeAndExpiresTime(userId:string, newCode:string,newExpiresAt:string): Promise<void>{
        return await this.userRepository.updateRecoverPasswordCodeAndExpiresTime(userId,newCode,newExpiresAt);
    }
    async setNewPassword(userId: string, newPassword:string){
        return await this.userRepository.setNewPassword(userId,newPassword);
    }
}