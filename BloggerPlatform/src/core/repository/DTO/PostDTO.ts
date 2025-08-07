export class UpdatePostByIdDTO {
    constructor(
        readonly title:string,
        readonly shortDescription:string,
        readonly content:string,
        readonly blogId:string
    ) {}
}
export class CreatePostDTO {
    constructor(
        readonly blogId:string,
        readonly title:string,
        readonly shortDescription:string,
        readonly content:string
    ) {}
}
