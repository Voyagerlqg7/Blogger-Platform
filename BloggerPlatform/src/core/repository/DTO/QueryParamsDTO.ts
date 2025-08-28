export type BaseQueryDTO = {
    sortBy: string;
    sortDirection: 'asc' | 'desc';
    pageNumber: number;
    pageSize: number;
};

export type BlogsQueryDTO = BaseQueryDTO & {
    searchNameTerm: string | null;
};

export type PostsQueryDTO = BaseQueryDTO;

export type UsersQueryDTO = BaseQueryDTO & {
    searchLoginTerm: string | null;
    searchEmailTerm: string | null;
};