export class User{
    constructor(
        public readonly id: string,
        public login: string,
        public email: string,
        public password: string,
        public createdAt: Date,
    ) {}
}