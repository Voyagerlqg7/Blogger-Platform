export class User{
    constructor(
        public readonly id: string,
        public login: string,
        public email: string,
        public password: string,
        public createdAt: string,
        public confirmationCode: string | null,
        public expiresAt: string | null,
        public isConfirmed: boolean
    ) {}
}
export type UserViewModel = {
    id: string;
    login: string;
    email: string;
    createdAt: string;
}