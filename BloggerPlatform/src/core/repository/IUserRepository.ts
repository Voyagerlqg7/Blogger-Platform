import {User} from "../entities/User";
import {UsersQueryDTO,PagedResponse} from "./DTO/QueryParamsDTO";
import {UserViewModel} from "../entities/User";

export interface IUserRepository {
    registrationUser(user:User): Promise<UserViewModel>;
    createUser(user:User): Promise<UserViewModel>;
    getAllUsers(Q_params:UsersQueryDTO): Promise<PagedResponse<User>>;
    deleteUser(userId: string): Promise<void>;
    getUserById(userId: string): Promise<User|null>;
    findByLoginOrEmail(loginOrEmail:string): Promise<User|null>;
    updateStatusConfirmation(user:User):Promise<void>;
    updateCodeConfirmationAndExpiresTime(userId:string, newCode:string,newExpiresAt:string): Promise<void>
    getPasswordHash(loginOrEmail:string):Promise<string|null>;
    findByCodeConfirmation(codeConfirmation: string): Promise<User|null>;
}