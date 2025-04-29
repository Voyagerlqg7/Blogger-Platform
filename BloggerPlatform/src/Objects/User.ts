export type User ={
    id?: string,
    login: string,
    email: string,
    createdAt: string;
};
export type UsersPage = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: User[];
}