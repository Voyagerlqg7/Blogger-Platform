import {ObjectId} from "mongodb";
import bcrypt from 'bcrypt-ts'
import {NewUserTemplate, UserQueryParams} from "../routes/UserRouter";
import {userDBcollection, UsersDBController} from "../Repository/UserDBController";
import {UsersPage} from "../Objects/User";
import {UserDBType} from "../Objects/User";
import {PostDBController} from "../Repository/PostDBController";


export const UserService = {
    async GetAllUsers(queryParams:UserQueryParams): Promise<UsersPage | undefined> {
        return UsersDBController.GetAllUsers(queryParams);
    },
    async createUser(user:NewUserTemplate){
      const passwordSalt = await bcrypt.genSalt(10);
      const passwordHash = await this._generateHash(user.password, passwordSalt);

      const newUser : UserDBType={
          _id: new ObjectId(),
          userName: user.login,
          email: user.email,
          passwordHash,
          passwordSalt,
          createdAt: new Date().toString(),
      }
      return UsersDBController.AddNewUser(newUser);
    },
    async checkCredentials(loginOrEmail: string, password: string) {
        const user = await UsersDBController.findByLoginOrEmail(loginOrEmail);
        if (!user) return false;
        const passwordHash = await this._generateHash(password, user.passwordSalt);
        if (user.passwordHash !== passwordHash) {
            return false;
        }
        else {return true;}
    },
    async _generateHash(password:string, salt:string){
        const hash = await bcrypt.hash(password, salt);
        return hash;
    },
    async DeleteUserByID(id:string){
        return await UsersDBController.DeleteUserByID(id);
    }
}