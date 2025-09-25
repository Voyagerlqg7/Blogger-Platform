import {session} from "../models/SessionModel";
import {sessionDBCollection} from "../collections/collections";

export class SessionsRepository  {
    async create(session:session){
        await sessionDBCollection.insertOne(session);
    }
    async findByUserId(userId:string){
        return await sessionDBCollection.find({userId}).toArray();
    }
    async findByDeviceId(deviceId:string){
        return await sessionDBCollection.findOne({deviceId});
    }
    async updateLastActiveDate(deviceId: string, update: { lastActiveDate: Date; expirationDate?: Date }) {
        return await sessionDBCollection.updateOne(
            { deviceId },
            { $set: update }
        );
    }

    async deleteAllExcept(userId:string, deviceId:string){
        await sessionDBCollection.deleteMany({userId,deviceId:{$ne:deviceId}});
    }
    async deleteDeviceById(deviceId:string){
        await sessionDBCollection.deleteOne({deviceId});
    }
    async deleteExpired(now:Date){
        await sessionDBCollection.deleteMany({expirationDate: {$lt:now}});
    }
}