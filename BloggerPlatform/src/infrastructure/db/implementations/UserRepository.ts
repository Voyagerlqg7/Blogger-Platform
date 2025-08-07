import {IUserRepository} from "../../../core/repository/IUserRepository";
import {User} from "../../../core/entities/User";
import {usersDBCollection} from "../collections/collections";
import {ObjectId} from "mongodb";
import {UserMapper} from "../mappers/UserMapper";

export class UserRepository implements IUserRepository {
    async createUser(user: User): Promise<User> {
        const newUser = {
            _id: new ObjectId(user.id),
            accountData: {
                login: user.login,
                email: user.email,
                passwordHash: //Пока что в процессе переноса из старого
                passwordSalt:
                createdAt: new Date(user.createdAt),
            },
            emailConfirmation: {
                confirmationCode: "dummy-code",
                expiresAt: new Date().toISOString(),
                isConfirmed: true
            }
        };
        await usersDBCollection.insertOne(newUser);
        return UserMapper.toDomain(newUser);
    }

    async getAllUsers(): Promise<User[]> {
        const users = await usersDBCollection.find().sort({ "accountData.createdAt": -1 }).toArray();
        return users.map(UserMapper.toDomain);
    }

    async getUserById(userId: string): Promise<User | null> {
        const user = await usersDBCollection.findOne({ _id: new ObjectId(userId) });
        if (!user) return null;
        return UserMapper.toDomain(user);
    }

    async deleteUser(userId: string): Promise<void> {
        await usersDBCollection.deleteOne({ _id: new ObjectId(userId) });
    }
}
