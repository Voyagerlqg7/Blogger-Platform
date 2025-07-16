export class Blog {
    constructor(
        public readonly id: string,
        public name: string,
        public description: string,
        public websiteUrl: string,
        public isMembership: boolean,
        public createdAt: string
        ) {}
}