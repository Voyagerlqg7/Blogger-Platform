import {User} from "../../../core/entities/User";
import {UserDB} from "../models/UserModel";
import {UserViewModel} from "../models/UserModel";
import {ObjectId} from "mongodb";

export class UserMapper {
    static toDomain(userDB: UserDB):User{
        return new User(
            userDB._id.toString(),
            userDB.accountData.login,
            userDB.accountData.email,
            userDB.accountData.createdAt
        )
    }
    static toViewModel(user: User): UserViewModel {
        return {
            id: user.id,
            login: user.login,
            email: user.email,
            createdAt: new Date(user.createdAt),
        };
    }
}