import bcrypt from "bcryptjs"
import {userService} from "../composition";
import {NewUserTemplate} from "../../routes/UserRouter";
import {UserDB} from "../db/models/UserModel";
import {ObjectId} from "mongodb";
import {userDBCollection} from "../db/collections/collections";
import {UserRepository} from "../db/implementations/UserRepository";


export class UserServices{
    async generatePasswordSalt(){
        return await bcrypt.genSalt(10);
    }
    async generateHash(password:string, passwordSalt:string){
        const hash = await bcrypt.hash(password, passwordSalt);
        return hash;
    }
    async createUser(user:NewUserTemplate){
        const passwordSalt = await bcrypt.genSalt(10);
        const passwordHash = await this.generateHash(user.password, passwordSalt);

        const newUser : UserDB={
            _id: new ObjectId(),
            accountData: {
                login: user.login,
                email: user.email,
                passwordHash,
                passwordSalt,
                createdAt: new Date()
            },
            emailConfirmation: {
                confirmationCode: "Created by admin from POST Route",
                expiresAt: new Date(),
                isConfirmed: true
            }
        }
        //return
    }
    async checkCredentials(loginOrEmail: string, password: string) {
        try {
            const user = await userService.findByLoginOrEmail(loginOrEmail);
            if (!user) return undefined;

            const passwordHash = await this.generateHash(password, user.accountData.passwordSalt);

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
    }


}
