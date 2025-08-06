export class Post {
    constructor(
                public readonly id: string,
                public title: string,
                public content: string,
                public shortDescription: string,
                public blogId: string,
                public blogName: string,
                public createdAt: string,
    ){}
}