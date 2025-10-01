export class User{
    constructor(
        public readonly id: string,
        public login: string,
        public email: string,
        public password: string,
        public createdAt: string,
        public confirmationCode: string,
        public expiresAt: string,
        public isConfirmed: boolean,
        public recoverPasswordCode: string | null = null,
        public recoverPasswordExpiresAt: string | null = null
    ) {}
}
export type UserViewModel = {
    id: string;
    login: string;
    email: string;
    createdAt: string;
}