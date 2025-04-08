export type PostsDB = {
    id?: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName?: string
    createdAt?: string;
}
export type PostsPage = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: PostsDB[];
}