import {UsersDBController} from "../Repository/UserDBController";
import nodemailer from "nodemailer";
import {settings} from "../application/settings";
import { v4 as uuidv4 } from "uuid";
import {add} from "date-fns"

export const EmailService = {
    async SendEmailCodeConfirmation(login: string, email: string, code: string) {
        try {
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: settings.GOOGLE_GMAIL_EMAIL,
                    pass: settings.GOOGLE_GMAIL_APP_PASSWORD,
                },
            });

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
        const user = await UsersDBController.findByLoginOrEmail(email);
        const newCode = uuidv4();
        const newExpiresAt = add(new Date(), { minutes: 5 }).toISOString();

        if (!user || user.emailConfirmation.isConfirmed) {
            return false;
        }

        await UsersDBController.UpdateCodeConfirmationAndExpiresTime(user._id, newCode, newExpiresAt);
        await this.SendEmailCodeConfirmation(user.accountData.login, user.accountData.email, newCode);
        return true;
    },
    async CheckCodeConfirmation(code: string): Promise<boolean | undefined> {
        const user = await UsersDBController.FindByConfirmationCode(code);
        if (!user) return undefined;

        const isExpired = new Date() > new Date(user.emailConfirmation.expiresAt);
        const isConfirmed = user.emailConfirmation.isConfirmed;

        if (isConfirmed || isExpired) return false;

        await UsersDBController.UpdateStatusConfirmation(user);
        return true;
    }

}