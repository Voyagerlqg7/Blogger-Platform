export type CommentDB = {
    id?: string,
    content: string,
    commentatorInfo: {
        "userId": string,
        "userLogin": string
    },
    createdAt?: string;
}
export type NewComment={
    content: string
}
//for future pagination
export type CommentPage = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: CommentDB[];
}