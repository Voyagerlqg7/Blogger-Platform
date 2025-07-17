import{IUserRepository} from "../../repository/IUserRepository";

export class DeleteUserService {
    constructor(private readonly userRepository:IUserRepository) {
    }
    async execute(userId:string): Promise<void> {
        const user = await this.userRepository.getUserById(userId);
        if (!user) {
            throw new Error(`User with id ${userId} not found`);
        }
        return await this.userRepository.deleteUser(userId);
    }
}