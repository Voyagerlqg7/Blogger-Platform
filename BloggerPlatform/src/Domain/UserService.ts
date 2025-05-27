import {ObjectId} from "mongodb";
import bcrypt from "bcryptjs"
import {NewUserTemplate, UserQueryParams} from "../routes/UserRouter";
import {UsersDBController} from "../Repository/UserDBController";
import {UsersPage} from "../Objects/User";
import {UserDBType} from "../Objects/User";


export const UserService = {
    async GetAllUsers(queryParams:UserQueryParams): Promise<UsersPage | undefined> {
        return UsersDBController.GetAllUsers(queryParams);
    },
    async createUser(user:NewUserTemplate){
      const passwordSalt = await bcrypt.genSalt(10);
      const passwordHash = await this._generateHash(user.password, passwordSalt);

      const newUser : UserDBType={
          _id: new ObjectId(),
          login: user.login,
          email: user.email,
          passwordHash,
          passwordSalt,
          createdAt: new Date().toISOString(),
      }
      return UsersDBController.AddNewUser(newUser);
    },
    async checkCredentials(loginOrEmail: string, password: string) {
        try {
            const user = await UsersDBController.findByLoginOrEmail(loginOrEmail);
            if (!user) return undefined;
            const passwordHash = await this._generateHash(password, user.passwordSalt);
            if (user.passwordHash !== passwordHash) {
                return undefined;
            }
        }
        catch(error) {
            console.error(error);
            return undefined;
        }
    },
    async _generateHash(password:string, salt:string){
        const hash = await bcrypt.hash(password, salt);
        return hash;
    },
    async DeleteUserByID(id:string){
        return await UsersDBController.DeleteUserByID(id);
    },
    async FindUserById(id:ObjectId){
        const user =  await UsersDBController.FindUserById(id.toString());
        return user;
    }
}