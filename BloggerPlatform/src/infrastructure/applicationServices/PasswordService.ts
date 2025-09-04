import bcrypt from "bcryptjs"
import {userService} from "../composition";
import {UserMapper} from "../db/mappers/UserMapper";

export class PasswordService {
    async generatePasswordSalt(){
        return await bcrypt.genSalt(10);
    }
    async generateHash(password:string, passwordSalt:string){
         return await bcrypt.hash(password, passwordSalt);
    }
    async checkCredentials(loginOrEmail: string, password: string) {
        try {
            const passwordHash = await userService.getPasswordHash(loginOrEmail);
            if (!passwordHash) return undefined;

            const isValid = bcrypt.compare(password, passwordHash);
            if (!isValid) return undefined;

            const user = await userService.findByLoginOrEmail(loginOrEmail);
            return user ? UserMapper.toViewModel(user) : undefined;
        } catch (error) {
            console.error(error);
            return undefined;
        }
    }
}
