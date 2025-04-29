import { client } from "../mongo/ConnectDB";
import {User, UserDBType} from '../Objects/User';
import {UsersPage} from "../Objects/User";
import {UserQueryParams} from "../routes/UserRouter";

export const userDBcollection = client.db("BloggerPlatform").collection<UserDBType>("users");

export const UsersDBController = {
    async GetAllUsers(queryParams:UserQueryParams): Promise<UsersPage | undefined> {
        try {
            const {
                sortBy,
                sortDirection,
                pageNumber,
                pageSize,
                searchLoginTerm,
                searchEmailTerm,
            } = queryParams;


            //как это всё обработать
            const totalCount = await userDBcollection.countDocuments()
            const pagesCount = Math.ceil(totalCount / pageSize);
            const sort: Record<string, 1|-1> = {
                [sortBy]:sortDirection === 'asc'? 1: -1
            };

            const users = await userDBcollection
                .find({login: searchLoginTerm, email: searchEmailTerm })
                .sort(sort)
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .toArray();

            const items = users.map(user => ({
                id: user._id.toString(),
                login: user.userName,
                email: user.email,
                createdAt: user.createdAt,
            }));
            return {
                pagesCount,
                page: pageNumber,
                pageSize,
                totalCount,
                items
            };

        } catch (error) {
            console.error('Error fetching users', error);
            throw new Error("Failed to fetch users");
        }
    },
    async CreateNewUser(){

    },
    async findByLoginOrEmail(loginOrEmail:string) {
        const user = await userDBcollection.findOne({$or: [{email: loginOrEmail}, {userName: loginOrEmail}]});
        return user;
    }


}