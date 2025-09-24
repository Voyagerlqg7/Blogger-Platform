import {RequestHandler} from "express";
import {UsersQueryDTO} from "../../core/repository/DTO/QueryParamsDTO";
import {getQueryParams} from "../helpers/queryHelper";
import {injectable, inject} from "inversify";
import {UserService} from "../../core/services/UserService";

@injectable()
export class UserHTTPController {
    constructor(@inject(UserService) private userService: UserService) {
    }
    getAllUsers: RequestHandler = async (req, res) => {
        try {
            const query: UsersQueryDTO = getQueryParams<
                Pick<UsersQueryDTO, "searchLoginTerm" | "searchEmailTerm">
            >(req, {
                searchLoginTerm: "string",
                searchEmailTerm: "string",
            });

            const users = await this.userService.getAllUsers(query);
            res.status(200).json(users);
        } catch (error) {
            console.error("Get all users error:", error);
            res.status(500).send("Internal server error");
        }
    };
    getUserById: RequestHandler = async (req, res) => {
        try {
            const user = await this.userService.getUserById(req.params.id);
            if (!user) {
                res.status(404).send("User not found!");
                return;
            }
            res.status(200).json(user);
        } catch (error) {
            console.error("Get user by id error:", error);
            res.status(500).send("Internal server error");
        }
    };
    deleteUserById: RequestHandler = async (req, res) => {
        try {
            const user = await this.userService.getUserById(req.params.id);
            if (!user) {
                res.status(404).send("User not found!");
                return;
            }

            await this.userService.deleteUser(req.params.id);
            res.status(204).send();
        } catch (error) {
            console.error("Delete user error:", error);
            res.status(500).send("Internal server error");
        }
    };
    createUser: RequestHandler = async (req, res) => {
        try {
            const {login, password, email} = req.body;
            const dto = {login, password, email};
            const newUser = await this.userService.createUser(dto);

            if (!newUser) {
                res.status(400).send("User not created!");
                return;
            }

            res.status(201).json(newUser);
        } catch (error) {
            console.error("Create user error:", error);
            res.status(500).send("Internal server error");
        }
    };
}
