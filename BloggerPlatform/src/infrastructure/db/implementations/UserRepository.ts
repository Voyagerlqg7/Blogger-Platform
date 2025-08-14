import {IUserRepository} from "../../../core/repository/IUserRepository";
import {User} from "../../../core/entities/User";
import {userDBCollection} from "../collections/collections";
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
        await userDBCollection.insertOne(newUser);
        return UserMapper.toDomain(newUser);
    }

    async getAllUsers(): Promise<User[]> {
        const users = await userDBCollection.find().sort({ "accountData.createdAt": -1 }).toArray();
        return users.map(UserMapper.toDomain);
    }

    async getUserById(userId: string): Promise<User | null> {
        const user = await userDBCollection.findOne({ _id: new ObjectId(userId) });
        if (!user) return null;
        return UserMapper.toDomain(user);
    }

    async deleteUser(userId: string): Promise<void> {
        await userDBCollection.deleteOne({ _id: new ObjectId(userId) });
    }
    async findByLoginOrEmail(loginOrEmail:string):Promise<User | null> {
        try {
            const user = await userDBCollection.findOne({
                $or: [
                    { "accountData.login": loginOrEmail },
                    { "accountData.email": loginOrEmail }
                ]
            });
            return UserMapper.toDomain(user);
        }
        catch (error){
            console.error(error);
            return null;
        }
    }
    async updateStatusConfirmation(user:User) {
        try {
            await userDBCollection.updateOne(
                { _id: user._id},
                { $set: { "emailConfirmation.isConfirmed": true } }
            );
        } catch (error) {
            console.error("Error to update confirmation status for userId:", user._id," ", error);
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
