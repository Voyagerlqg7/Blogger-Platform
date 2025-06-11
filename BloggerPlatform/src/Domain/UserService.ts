import {ObjectId} from "mongodb";
import bcrypt from "bcryptjs"
import {NewUserTemplate, UserQueryParams} from "../routes/UserRouter";
import {UsersDBController} from "../Repository/UserDBController";
import {UsersPage} from "../Objects/User";
import {UserDBType} from "../Objects/User";
import { v4 as uuidv4 } from "uuid";
import add from "date-fns/add";
import {EmailService} from "./EmailService";


export const UserService = {
    async GetAllUsers(queryParams:UserQueryParams): Promise<UsersPage | undefined> {
        return UsersDBController.GetAllUsers(queryParams);
    },
    async createUser(user:NewUserTemplate){
      const passwordSalt = await bcrypt.genSalt(10);
      const passwordHash = await this._generateHash(user.password, passwordSalt);

      const newUser : UserDBType={
          _id: new ObjectId(),
          accountData: {
              login: user.login,
              email: user.email,
              passwordHash,
              passwordSalt,
              createdAt: new Date().toISOString()
          },
          emailConfirmation: {
              confirmationCode: "Created by admin from POST Route",
              expiresAt: new Date().toISOString(),
              isConfirmed: true
          }
      }
      return UsersDBController.AddNewUser(newUser);
    },
    async RegistrationUser(user:NewUserTemplate){
        const passwordSalt = await bcrypt.genSalt(10);
        const passwordHash = await this._generateHash(user.password, passwordSalt);

        const newUser : UserDBType={
            _id: new ObjectId(),
            accountData: {
                login: user.login,
                email: user.email,
                passwordHash,
                passwordSalt,
                createdAt: new Date().toISOString()
            },
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expiresAt: new Date().toISOString(),
                isConfirmed: false
            }
        }
        await EmailService.SendEmailCodeConfirmation(newUser);
        return UsersDBController.AddNewUser(newUser);
    },
    async checkCredentials(loginOrEmail: string, password: string) {
        try {
            const user = await UsersDBController.findByLoginOrEmail(loginOrEmail);
            if (!user) return undefined;

            const passwordHash = await this._generateHash(password, user.accountData.passwordSalt);

            if (user.accountData.passwordHash !== passwordHash) {
                return undefined;
            }
            return user;
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