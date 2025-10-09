import mongoose from "mongoose";

export type UserDB = {
    _id: string,
    accountData: {
        login: string,
        email: string,
        passwordHash: string,
        passwordSalt: string,
        createdAt: Date
    },
    emailConfirmation: {
        confirmationCode: string,
        expiresAt: Date,
        isConfirmed: boolean
    }
    recoverPasswordInfo:{
        code:string | null,
        expiresAt:Date | null
    }
}

export const UserSchema = new mongoose.Schema<UserDB>({
    _id: { type: String, required: true },
    accountData: ({
        login: {type: String, required: true},
        email: {type: String, required: true},
        passwordHash: {type: String, required: true},
        passwordSalt: {type: String, required: true},
        createdAt: {type: Date, required: true},
    }),
    emailConfirmation: ({
        confirmationCode: {type: String, required: true},
        expiresAt: {type: Date, required: true},
        isConfirmed: Boolean,
    }),
    recoverPasswordInfo: ({
        code: { type: String, default: null },
        expiresAt: { type: Date, default: null },
    })
})