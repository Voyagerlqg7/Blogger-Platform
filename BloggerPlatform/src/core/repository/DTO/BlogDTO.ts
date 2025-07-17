export class CreateBlogDTO{
    constructor(
        readonly name:string,
        readonly description:string,
        readonly websiteUrl:string
    ){}
}
export class UpdateBlogDTO{
    constructor(
        readonly name:string,
        readonly description:string,
        readonly websiteUrl:string
    ){}
}