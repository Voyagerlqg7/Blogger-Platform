import {UsersDBController} from "../Repository/UserDBController";
import nodemailer from "nodemailer";



export const EmailService = {
    async CheckExistingEmailOrLogin(login: string, email: string): Promise<undefined> {
        const existingUser = await UsersDBController.findByLoginOrEmail(login)
            || await UsersDBController.findByLoginOrEmail(email);
        if(existingUser){
            return undefined;
        }
    },
    async SendEmailCodeConfirmation(email:string){
        // Create a test account or replace with real credentials.
        const transporter = nodemailer.createTransport({
            service: "gmail",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: "maddison53@ethereal.email",
                pass: "jn7jnAPss4f63QBp6D",
            },
        });

    },
    async ReSendEmailCodeConfirmation(){

    }


}