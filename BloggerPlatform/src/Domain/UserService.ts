import {ObjectId} from "mongodb";
import bcrypt from "bcryptjs"
import {NewUserTemplate, UserQueryParams} from "../routes/UserRouter";
import {UsersDBController} from "../Repository/UserDBController";
import {UsersPage, UserViewModel} from "../Objects/User";
import {UserDBType} from "../Objects/User";
import { v4 as uuidv4 } from "uuid";
import {add} from "date-fns/add";
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
                expiresAt: add(new Date(), { minutes: 5 }).toISOString(),
                isConfirmed: false
            }
        }
        await UsersDBController.AddNewUser(newUser);

        const result = await EmailService.SendEmailCodeConfirmation(
            newUser.accountData.login,
            newUser.accountData.email,
            newUser.emailConfirmation.confirmationCode
        );

        if (result) {
            return true;
        } else {
            await UsersDBController.DeleteUserByID(newUser._id.toString());
            return undefined;
        }
    },
    async checkCredentials(loginOrEmail: string, password: string) {
        try {
            const user = await UsersDBController.findByLoginOrEmail(loginOrEmail);
            if (!user) return undefined;

            const passwordHash = await this._generateHash(password, user.accountData.passwordSalt);

            if (user.accountData.passwordHash !== passwordHash) {
                return undefined;
            }
            const newUser: UserViewModel ={
                id: user._id.toString(),
                login: user.accountData.login,
                email: user.accountData.email,
                createdAt: user.accountData.createdAt
            }
            return newUser;
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
    async FindUserById(id:string){
        const user =  await UsersDBController.FindUserById(id.toString());
        return user;
    }
}