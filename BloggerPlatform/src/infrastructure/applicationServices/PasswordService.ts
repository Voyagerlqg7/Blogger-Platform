import bcrypt from "bcryptjs"
import {userService} from "../composition";

export class PasswordService {
    async generatePasswordSalt(){
        return await bcrypt.genSalt(10);
    }
    async generateHash(password:string, passwordSalt:string){
        const hash = await bcrypt.hash(password, passwordSalt);
        return hash;
    }
    async checkCredentials(loginOrEmail: string, password: string) {
        try {
            const user = await userService.findByLoginOrEmail(loginOrEmail);
            if (!user) return undefined;

            const isValid = await bcrypt.compare(password, user.accountData.passwordHash);
            if (!isValid) return undefined;

            return {
                id: user._id.toString(),
                login: user.accountData.login,
                email: user.accountData.email,
                createdAt: user.accountData.createdAt
            } as UserViewModel;
        }
        catch(error) {
            console.error(error);
            return undefined;
        }
    }

}
