import {UsersDBController} from "../Repository/UserDBController";
import nodemailer from "nodemailer";
import {settings} from "../application/settings";
import {UserDBType} from "../Objects/User";



export const EmailService = {
    async CheckExistingEmailOrLogin(LoginOrEmail: string): Promise<boolean> {
        const existingUser = await UsersDBController.findByLoginOrEmail(LoginOrEmail)
        return !!existingUser;
    },
    async SendEmailCodeConfirmation(login:string, email:string, code:string){
        try {
            const existingEmail = await this.CheckExistingEmailOrLogin(email);
            const existingLogin = await this.CheckExistingEmailOrLogin(login);
            if(existingEmail || existingLogin){
                return undefined
            }
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
                html: `<h1>Thanks for your registration</h1>
                        <p>To finish registration please follow the link below:
                        <a href='${confirmationLink}'>complete registration</a>
                        </p>
                        <p>Or use this code manually: ${code}</p>`,
                // text-версия для клиентов без поддержки HTML
                text: `Thank for your registration. To finish registration please follow this link: ${confirmationLink}\n\nOr use this code manually: ${code}`
            });
            return true;
        } catch (error) {
            console.error("Failed to create transporter:", error);
            return false;
        }
    },
}