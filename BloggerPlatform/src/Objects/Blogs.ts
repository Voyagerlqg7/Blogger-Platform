export type BlogsDB = {
    id?: string;
    name: string;
    description: string;
    websiteUrl: string;
    createdAt?: string;
    isMembership?: boolean;
}

export type BlogsPage = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: BlogsDB[];
}
