import {User} from "../../entities/User";
import {IUserRepository} from "../../repository/IUserRepository";

export class GetAllUsersService {
    constructor(private readonly userRepository: IUserRepository) {}
    async execute(): Promise<User[]> {
        return await this.userRepository.getAllUsers();
    }
}