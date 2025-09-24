import bcrypt from "bcryptjs"
import {UserMapper} from "../db/mappers/UserMapper";
import {injectable, inject} from "inversify";
import {UserService} from "../../core/services/UserService";
import {PasswordService} from "./PasswordService";

@injectable()
export class AuthService {
    constructor(
        @inject(UserService) private userService: UserService,
        @inject(PasswordService) private passwordService: PasswordService
    ) {}
    async checkCredentials(loginOrEmail: string, password: string) {
        try {
            const passwordHash = await this.userService.getPasswordHash(loginOrEmail);
            if (!passwordHash) return undefined;

            const isValid = await bcrypt.compare(password, passwordHash);
            if (!isValid) return undefined;

            const user = await this.userService.findByLoginOrEmail(loginOrEmail);
            return user ? UserMapper.toViewModel(user) : undefined;
        } catch (error) {
            console.error(error);
            return undefined;
        }
    }
}