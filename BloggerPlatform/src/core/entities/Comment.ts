export class Comment {
    constructor(
        public readonly id: string,
        public content: string,
        public userName: string,
        public userLogin: string,
        public createdAt: string,
    ){}
}