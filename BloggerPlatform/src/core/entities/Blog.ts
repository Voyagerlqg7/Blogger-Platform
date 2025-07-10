export class Blog {
    constructor(
        public readonly id: number,
        public name: string,
        public description: string,
        public websiteUrl: string,
        public isMembership: boolean,
        public createdAt: string
        ) {}
}