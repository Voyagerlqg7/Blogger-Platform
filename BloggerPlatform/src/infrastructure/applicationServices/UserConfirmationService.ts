import {UserService} from "../../core/services/UserService";
import {EmailService} from "./EmailService";
import {injectable, inject} from "inversify";
import {v4 as uuidv4} from "uuid";
import {add} from "date-fns"

@injectable()
export class UserConfirmationService {
    constructor(
        @inject(UserService) private userService: UserService,
        @inject(EmailService) private emailService: EmailService
    ) {}

    async sendEmailConfirmation(login: string, email: string): Promise<boolean> {
        const code = uuidv4();
        const expiresAt = add(new Date(), { minutes: 5 }).toISOString();
        await this.userService.updateCodeConfirmationAndExpiresTime(email, code, expiresAt);
        return await this.emailService.sendEmailConfirmation(email, login, code);
    }

    async resendCodeConfirmation(email: string): Promise<boolean> {
        const user = await this.userService.findByLoginOrEmail(email);

        if (!user || user.isConfirmed) {
            return false;
        }

        const newCode = uuidv4();
        const newExpiresAt = add(new Date(), { minutes: 5 }).toISOString();

        await this.userService.updateCodeConfirmationAndExpiresTime(email, newCode, newExpiresAt);
        return await this.emailService.sendEmailConfirmation(email, user.login, newCode);
    }

    async checkCodeConfirmation(code: string): Promise<boolean | undefined> {
        const user = await this.userService.findByCodeConfirmation(code);
        if (!user) return undefined;

        const isExpired = !user.expiresAt || new Date() > new Date(user.expiresAt);
        const isConfirmed = user.isConfirmed;

        if (isConfirmed || isExpired) return false;

        await this.userService.updateStatusConfirmation(user);
        return true;
    }
}