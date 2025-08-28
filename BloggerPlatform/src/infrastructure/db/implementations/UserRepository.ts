import {IUserRepository} from "../../../core/repository/IUserRepository";
import {User} from "../../../core/entities/User";
import {userDBCollection} from "../collections/collections";
import {ObjectId} from "mongodb";
import {UserMapper} from "../mappers/UserMapper";
import {UserDB} from "../models/UserModel";
import {PasswordService} from "../../applicationServices/PasswordService";
import {PagedResponse, UsersQueryDTO} from "../../../core/repository/DTO/QueryParamsDTO";

const passService = new PasswordService();


export class UserRepository implements IUserRepository {
    async createUser(user: User): Promise<User> {
        const passwordSalt = await passService.generatePasswordSalt();
        const passwordHash = await passService.generateHash(user.password, passwordSalt);

        const newUser : UserDB={
            _id: new ObjectId(),
            accountData: {
                login: user.login,
                email: user.email,
                passwordHash,
                passwordSalt,
                createdAt: new Date()
            },
            emailConfirmation: {
                confirmationCode: user.confirmationCode,
                expiresAt: new Date(user.expiresAt),
                isConfirmed: user.isConfirmed
            }
        }
        await userDBCollection.insertOne(newUser);
        return user;
    }

    async getAllUsers(query: UsersQueryDTO): Promise<PagedResponse<User>> {
        const filter: any = {};

        if (query.searchLoginTerm) {
            filter.login = { $regex: query.searchLoginTerm, $options: "i" };
        }

        if (query.searchEmailTerm) {
            filter.email = { $regex: query.searchEmailTerm, $options: "i" };
        }

        const totalCount = await userDBCollection.countDocuments(filter);

        const items = await userDBCollection
            .find(filter)
            .sort({ [query.sortBy]: query.sortDirection === "asc" ? 1 : -1 })
            .skip((query.pageNumber - 1) * query.pageSize)
            .limit(query.pageSize)
            .toArray();

        return {
            pagesCount: Math.ceil(totalCount / query.pageSize),
            page: query.pageNumber,
            pageSize: query.pageSize,
            totalCount,
            items: items.map(UserMapper.toDomain)
        };
    }


    async getUserById(userId: string): Promise<User | null> {
        const user = await userDBCollection.findOne({ _id: new ObjectId(userId) });
        if (!user) return null;
        return UserMapper.toDomain(user);
    }

    async deleteUser(userId: string): Promise<void> {
        await userDBCollection.deleteOne({ _id: new ObjectId(userId) });
    }
    async findByLoginOrEmail(loginOrEmail: string): Promise<User | null> {
        const user = await userDBCollection.findOne({
            $or: [
                { "accountData.login": loginOrEmail },
                { "accountData.email": loginOrEmail }
            ]
        });
        return user ? UserMapper.toDomain(user) : null;
    }
    async getPasswordHash(loginOrEmail: string): Promise<string | null> {
        const userAuthCredentials = await userDBCollection.findOne({
            $or: [
                { "accountData.login": loginOrEmail },
                { "accountData.email": loginOrEmail }
            ]
        });
        if (!userAuthCredentials) return null;
        else {return userAuthCredentials.accountData.passwordHash;}
    }


    async findByCodeConfirmation(codeConfirmation: string): Promise<User | null> {
        const user = await userDBCollection.findOne({
            "emailConfirmation.confirmationCode": codeConfirmation
        });
        return user ? UserMapper.toDomain(user) : null;
    }

    async updateStatusConfirmation(user: User): Promise<void> {
        try {
            await userDBCollection.updateOne(
                { _id: new ObjectId(user.id)},
                { $set: { "emailConfirmation.isConfirmed": true } }
            );
        } catch (error) {
            console.error("Error to update confirmation status for userId:", user.id," ", error);
        }
    }
    async updateCodeConfirmationAndExpiresTime(userId: string, newCode: string, newExpiresAt:string){
        await userDBCollection.updateOne(
            { _id: new ObjectId(userId) },
            {
                $set: {
                    "emailConfirmation.confirmationCode": newCode,
                    "emailConfirmation.expiresAt": newExpiresAt,
                    "emailConfirmation.isConfirmed": false
                }
            }
        );
    }
}
