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
    private async send(to: string, subject: string, html: string): Promise<boolean> {
        try {
            await transporter.sendMail({
                from: settings.GOOGLE_GMAIL_EMAIL,
                to,
                subject,
                html,
                text: "..."
            });
            return true;
        } catch (error) {
            console.error("Email sending failed:", error);
            return false;
        }
    }
    async sendEmail(email: string, code: string) {
        const html = `<h1>Thanks for your registration</h1>
                        <p>To finish registration please follow the link below:
                        <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>
                        </p>`;
        return this.send(email, "Verification Code Confirmation", html);
    }

    async sendPasswordReset(email: string, code: string) {
        const html = `<h1>Password recovery</h1>
                <p>To finish password recovery please follow the link below:
                <a href='https://somesite.com/password-recovery?recoveryCode=${code}'>recovery password</a>
                </p>`;
        return this.send(email, "Password recovery code", html);
    }

}