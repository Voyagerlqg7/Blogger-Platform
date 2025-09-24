import nodemailer from "nodemailer";
import {settings} from "../settings/settings";
import {injectable, inject} from "inversify";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: settings.GOOGLE_GMAIL_EMAIL,
        pass: settings.GOOGLE_GMAIL_APP_PASSWORD,
    },
});


@injectable()
export class EmailService {
    async sendEmailConfirmation(email: string, login: string, code: string): Promise<boolean> {
        try {
            const confirmationLink = `https://somesite.com/confirm-email?code=${code}`;

            await transporter.sendMail({
                from: settings.GOOGLE_GMAIL_EMAIL,
                to: email,
                subject: "Verification Code Confirmation",
                html: `...`,
                text: `...`
            });

            return true;
        } catch (error) {
            console.error("Failed to send confirmation email:", error);
            return false;
        }
    }

    //async sendPasswordReset(email: string, resetToken: string): Promise<boolean> {
        // Логика отправки email для сброса пароля}
}