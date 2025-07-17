export class UpdatePostByIdDTO {
    constructor(
        readonly title:string,
        readonly shortDescription:string,
        readonly content:string,
        readonly blogId:string
    ) {}
}
export class CreatePostByBlogIdDTO {
    constructor(
        readonly blogId:string,
        readonly title:string,
        readonly shortDescription:string,
        readonly content:string
    ) {}
}
export class CreateCommentDTO {
    constructor(
        readonly content:string,
    ) {
    }
}
export class CreatePostForSpecialBlogDTO{
    constructor(
        readonly blogId: string,
        readonly title:string,
        readonly shortDescription:string,
        readonly content:string
    ){}
}