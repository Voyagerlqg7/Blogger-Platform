import { client } from "../mongo/ConnectDB";
import {User, UserDBType} from '../Objects/User';
import {UsersPage} from "../Objects/User";
import {UserQueryParams} from "../routes/UserRouter";
import {ObjectId} from "mongodb";

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
            const filter: Record<string, any> = {};

            if (searchLoginTerm) {
                filter.login = { $regex: searchLoginTerm, $options: 'i' }; // частичное совпадение + без учета регистра
            }
            if (searchEmailTerm) {
                filter.email = { $regex: searchEmailTerm, $options: 'i' };
            }


            const users = await userDBcollection
                .find(filter)
                .sort(sort)
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .toArray();

            const items = users.map(user => ({
                id: user._id.toString(),
                login: user.login,
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
    async AddNewUser(newUser:UserDBType): Promise<User | undefined> {
        try {
            userDBcollection.insertOne(newUser);

            const addedUser = {
                id: newUser._id.toString(),
                login: newUser.login,
                email: newUser.email,
                createdAt: new Date().toISOString(),
            }
            return addedUser;
        }
        catch (error){
            console.error(error);
            throw new Error("something going wrong with adding new user");
        }

    },
    async findByLoginOrEmail(loginOrEmail:string) {
        const user = await userDBcollection.findOne({$or: [{email: loginOrEmail}, {userName: loginOrEmail}]});
        return user;
    },
    async DeleteUserByID(id: string | null): Promise<boolean>{
        if(!id) return false;
        if (!ObjectId.isValid(id)) {
            console.error("Invalid user ID:", id);
            return false;
        }
        try {
            const deleteResult = await userDBcollection.deleteOne({ _id: new ObjectId(id) });
            return deleteResult.deletedCount > 0;
        } catch (error) {
            console.error("Error deleting user by ID:", error);
            throw new Error("Failed to delete user");
        }
    }
}