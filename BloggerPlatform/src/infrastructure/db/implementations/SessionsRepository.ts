import {session} from "../Schemas/SessionModel";
import {SessionModel} from "../Models/collections";

export class SessionsRepository  {
    async create(session:session){
        await SessionModel.insertOne(session);
    }
    async findByUserId(userId:string){
        return await SessionModel.find({userId}).lean();
    }
    async findByDeviceId(deviceId:string){
        return await SessionModel.findOne({deviceId});
    }
    async updateLastActiveDate(deviceId: string, update: { lastActiveDate: Date; expirationDate?: Date }) {
        return await SessionModel.updateOne(
            { deviceId },
            { $set: update }
        );
    }

    async deleteAllExcept(userId:string, deviceId:string){
        await SessionModel.deleteMany({userId,deviceId:{$ne:deviceId}});
    }
    async deleteDeviceById(deviceId:string){
        await SessionModel.deleteOne({deviceId});
    }
    async deleteExpired(now:Date){
        await SessionModel.deleteMany({expirationDate: {$lt:now}});
    }
}