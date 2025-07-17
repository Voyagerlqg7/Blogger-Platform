import {User} from "../../entities/User";
import {UserDTO} from "../../repository/DTO/UserDTO";
import{IUserRepository} from "../../repository/IUserRepository";
import {v4 as uuidv4} from "uuid";

export class CreateUserService {
    constructor(private readonly userRepository:IUserRepository) {
    }
    async execute(userDTO:UserDTO): Promise<User> {
        const id = uuidv4();
        const newUser = new User(
            id,
            userDTO.login,
            userDTO.email,
            userDTO.password,
            new Date().toISOString(),
        )
        return await this.userRepository.createUser(newUser);
    }
}