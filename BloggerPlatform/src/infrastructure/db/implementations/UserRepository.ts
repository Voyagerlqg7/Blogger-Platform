import {IUserRepository} from "../../../core/repository/IUserRepository";
import {User} from "../../../core/entities/User";
import {ObjectId} from "mongodb"

export class UserRepository implements IUserRepository {
    async deleteUser():Promise<void> {

    }
    async getUserById(blogId:string):Promise<User> {

    }
    async createUser(user:User):Promise<User> {

    }
    async getAllUsers():Promise<User[]> {

    }
}