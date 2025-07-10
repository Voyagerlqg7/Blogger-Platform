export class CreateBlogDTO{
    constructor(
        readonly name:string,
        readonly description:string,
        readonly websiteUrl:string
    ){}
}
export class CreatePostForSpecialBlogDTO{
    constructor(
        readonly blogId: string,
        readonly title:string,
        readonly shortDescription:string,
        readonly content:string
    ){}
}