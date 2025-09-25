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