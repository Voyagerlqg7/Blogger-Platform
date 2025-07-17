import {User} from "../../entities/User";
import {IUserRepository} from "../../repository/IUserRepository";

export class GetUserByIdService {
    constructor(private readonly userRepository:IUserRepository) {}
    async execute(userId:string): Promise<User|null> {
        return await this.userRepository.getUserById(userId);
    }
}