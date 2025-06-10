import {UsersDBController} from "../Repository/UserDBController";
const nodemailer = require("nodemailer");



export const EmailService = {
    async CheckExistingEmailOrLogin(login: string, email: string): Promise<undefined> {
        const existingUser = await UsersDBController.findByLoginOrEmail(login)
            || await UsersDBController.findByLoginOrEmail(email);
        if(existingUser){
            return undefined;
        }
    },
    async SendEmailCodeConfirmation(){

    },
    async ReSendEmailCodeConfirmation(){

    }


}