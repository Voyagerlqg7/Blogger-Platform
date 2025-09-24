import bcrypt from "bcryptjs"
import { injectable, inject} from "inversify";

@injectable()
export class PasswordService {
    async generatePasswordSalt(){
        return await bcrypt.genSalt(10);
    }
    async generateHash(password:string, passwordSalt:string){
         return await bcrypt.hash(password, passwordSalt);
    }
}
