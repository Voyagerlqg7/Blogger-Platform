import {UserRepository} from "../db/implementations/UserRepository";
import nodemailer from "nodemailer";
import {settings} from "../settings/settings";
import { v4 as uuidv4 } from "uuid";
import {add} from "date-fns"

const UserRepo = new UserRepository();
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: settings.GOOGLE_GMAIL_EMAIL,
        pass: settings.GOOGLE_GMAIL_APP_PASSWORD,
    },
});

export const EmailService = {
    async SendEmailCodeConfirmation(login: string, email: string, code: string) {
        try {
            const confirmationLink = `https://somesite.com/confirm-email?code=${code}`;

            await transporter.sendMail({
                from: settings.GOOGLE_GMAIL_EMAIL,
                to: email,
                subject: "Verification Code Confirmation",
                html: `
                <h1>Thanks for your registration</h1>
                <p>To finish registration please follow the link below:</p>
                <a href="${confirmationLink}">Complete registration</a>
                <p>Or use this code manually: <strong>${code}</strong></p>
            `,
                text: `Thank you for your registration. To finish, go to this link: ${confirmationLink} or use code: ${code}`
            });

            return true;
        } catch (error) {
            console.error("Failed to send confirmation email:", error);
            return false;
        }

    },
    async ReSendCodeConfirmation(email:string){
        const user = await UserRepo.findByLoginOrEmail(email);
        const newCode = uuidv4();
        const newExpiresAt = add(new Date(), { minutes: 5 }).toISOString();

        if (!user || user.isConfirmed) {
            return false;
        }

        await UserRepo.updateCodeConfirmationAndExpiresTime(user.id.toString(), newCode, newExpiresAt);
        await this.SendEmailCodeConfirmation(user.login, user.email, newCode);
        return true;
    },
    async CheckCodeConfirmation(code: string): Promise<boolean | undefined> {
        const user = await UserRepo.findByCodeConfirmation(code);
        if (!user) return undefined;

        const isExpired = new Date() > new Date(user.expiresAt);
        const isConfirmed = user.isConfirmed;

        if (isConfirmed || isExpired) return false;

        await UserRepo.updateStatusConfirmation(user);
        return true;
    }

}