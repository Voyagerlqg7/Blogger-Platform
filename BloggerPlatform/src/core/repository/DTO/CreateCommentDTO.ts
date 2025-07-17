export class CreateCommentDTO {
    constructor(
        readonly content: string,
        readonly userName: string,
        readonly userLogin: string,
    ) {
    }
}