import {ObjectId} from "mongodb";
import bcrypt from 'bcrypt-ts'
import {NewUserTemplate, UserQueryParams} from "../routes/UserRouter";
import {userDBcollection, UsersDBController} from "../Repository/UserDBController";
import {UsersPage} from "../Objects/User";


export const UserService = {
    async GetAllUsers(queryParams:UserQueryParams): Promise<UsersPage | undefined> {
        return UsersDBController.GetAllUsers(queryParams);
    },
    async createUser(user:NewUserTemplate){
      const passwordSalt = await bcrypt.genSalt(10);
      const passwordHash = await this._generateHash(user.password, passwordSalt);

      //UserDBType!!!!!!!!!!!!
      const newUser:UserDBType ={
          _id: new ObjectId(),
          userName: user.login,
          email: user.email,
          passwordHash,
          passwordSalt,
          createdAt: new Date(),
      }
      return UsersDBController.CreateNewUser(newUser);
    },
    async checkCredentials(loginOrEmail:string, password:string){
        const user = await UsersDBController.findByLoginOrEmail(loginOrEmail);
        if(!user) return false;
        const passwordHash = await this._generateHash(password, user.passwordSalt);
        if(user.passwordHash !== passwordHash){
            return false;
        }
    },
    async _generateHash(password:string, salt:string){
        const hash = await bcrypt.hash(password, salt);
        return hash;
    }
}