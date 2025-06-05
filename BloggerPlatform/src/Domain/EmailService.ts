import {NewUserTemplate} from "../routes/UserRouter";
import {UsersDBController} from "../Repository/UserDBController";
import {UserService} from "./UserService";
const nodemailer = require("nodemailer");



export const EmailService = {
    async RegistrationProcess(login: string, password: string, email: string): Promise<true | undefined> {
        const existingUser =
            await UsersDBController.findByLoginOrEmail(login)
            ||
            await UsersDBController.findByLoginOrEmail(email);

        if (existingUser) {
            return undefined;
        }

        const NewRegisteredUser: NewUserTemplate = {
            login,
            password,
            email
        };

        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: "maddison53@ethereal.email",
                pass: "jn7jnAPss4f63QBp6D",
            },
        });

        // Wrap in an async IIFE so we can use await.
        (async () => {
            const info = await transporter.sendMail({
                from: '"Maddison Foo Koch" <maddison53@ethereal.email>',
                to: "bar@example.com, baz@example.com",
                subject: "Hello ✔",
                text: "Hello world?", // plain‑text body
                html: "<b>Hello world?</b>", // HTML body
            });

            console.log("Message sent:", info.messageId);
        })();

        UserService.createUser(NewRegisteredUser);
        return true;
    }


}