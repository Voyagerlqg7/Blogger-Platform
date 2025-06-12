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
                    user: process.env.GOOGLE_GMAIL_EMAIL,
                    pass: process.env.GOOGLE_GMAIL_PASSWORD,
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

        if (!user) return false;

        await UsersDBController.UpdateCodeConfirmationAndExpiresTime(user._id, newCode, newExpiresAt);
        await this.SendEmailCodeConfirmation(user.accountData.login, user.accountData.email, newCode);
        return true;
    },
    async CheckCodeConfirmation(code:string){
        const user = await UsersDBController.FindByConfirmationCode(code);
        if (!user || user.emailConfirmation.isConfirmed || new Date() > new Date(user.emailConfirmation.expiresAt)) {
            return false;
        }
        else{
            await UsersDBController.UpdateStatusConfirmation(user);
            return true;
        }
    }
}