export class Comment {
    constructor(
        public readonly id: string,
        public content: string,
        public commentatorInfo:{
            userName: string;
            userLogin: string;
        },
        public createdAt: string,
    ){}
}