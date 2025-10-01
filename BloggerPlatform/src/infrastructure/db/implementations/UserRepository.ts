import {IUserRepository} from "../../../core/repository/IUserRepository";
import {User, UserViewModel} from "../../../core/entities/User";
import {userDBCollection} from "../collections/collections";
import {UserMapper} from "../mappers/UserMapper";
import {UserDB} from "../models/UserModel";
import {UsersQueryDTO} from "../../../core/repository/DTO/QueryParamsDTO";
import {PagedResponse} from "../../../core/repository/DTO/QueryParamsDTO";
import {PasswordService} from "../../applicationServices/PasswordService";
import { injectable, inject} from "inversify";

@injectable()
export class UserRepository implements IUserRepository {
    constructor(@inject (PasswordService) private readonly passwordService: PasswordService) {}
    async createUser(user: User): Promise<UserViewModel> {
        const passwordSalt = await this.passwordService.generatePasswordSalt();
        const passwordHash = await this.passwordService.generateHash(user.password, passwordSalt);

        const newUser : UserDB={
            _id: user.id,
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
            },
            recoverPasswordInfo:{
                code:null,
                expiresAt:null
            }
        }
        await userDBCollection.insertOne(newUser);
        return UserMapper.toViewModel(UserMapper.toDomain(newUser));
    }


    async registrationUser(user: User): Promise<UserViewModel> {
        const passwordSalt = await this.passwordService.generatePasswordSalt();
        const passwordHash = await this.passwordService.generateHash(user.password, passwordSalt);

        const newUser : UserDB={
            _id: user.id,
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
            },
            recoverPasswordInfo:{
                code:null,
                expiresAt:null
            }
        }
        await userDBCollection.insertOne(newUser);
        return UserMapper.toViewModel(UserMapper.toDomain(newUser));
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
        const user = await userDBCollection.findOne({ _id: userId });
        if (!user) return null;
        return UserMapper.toDomain(user);
    }

    async deleteUser(userId: string): Promise<void> {
        await userDBCollection.deleteOne({ _id: userId});
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
    async findByRecoverPasswordCode(code: string): Promise<User | null> {
        const user = await userDBCollection.findOne({
            "recoverPasswordInfo.code": code
        });
        return user ? UserMapper.toDomain(user) : null;
    }
    async updateStatusConfirmation(user: User): Promise<void> {
        try {
            await userDBCollection.updateOne(
                { _id: user.id},
                { $set: { "emailConfirmation.isConfirmed": true } }
            );
        } catch (error) {
            console.error("Error to update confirmation status for userId:", user.id," ", error);
        }
    }
    async updateCodeConfirmationAndExpiresTime(userId: string, newCode: string, newExpiresAt:string){
        await userDBCollection.updateOne(
            { _id: userId },
            {
                $set: {
                    "emailConfirmation.confirmationCode": newCode,
                    "emailConfirmation.expiresAt": new Date(newExpiresAt),
                    "emailConfirmation.isConfirmed": false
                }
            }
        );
    }
    async updateRecoverPasswordCodeAndExpiresTime(userId: string, newCode: string, newExpiresAt:string){
        await userDBCollection.updateOne(
            { _id: userId },
            {
                $set: {
                    "recoverPasswordInfo.code": newCode,
                    "recoverPasswordInfo.expiresAt": new Date(newExpiresAt),

                }
            }
        );
    }
    async setNewPassword(userId: string, newPassword:string){
        const passwordSalt = await this.passwordService.generatePasswordSalt();
        const passwordHash = await this.passwordService.generateHash(newPassword, passwordSalt);
        await userDBCollection.updateOne(
            { _id: userId },
            {
                $set: {
                    "accountData.passwordHash": passwordHash,
                    "accountData.passwordSalt": passwordSalt,

                }
            }
        );
    }
}
