import {IUserRepository} from "../../../core/repository/IUserRepository";
import {User} from "../../../core/entities/User";
import {UserDB} from "../models/UserModel";


export class UserRepository implements IUserRepository {
    async createBlogById(blogId:string):Promise<User> {

    }
    async getAllBlogsByUserId(blogId:string):Promise<Users[]> {

    }
    async deleteUser():Promise<void> {

    }
    async getUserById(blogId:string):Promise<User> {

    }
}