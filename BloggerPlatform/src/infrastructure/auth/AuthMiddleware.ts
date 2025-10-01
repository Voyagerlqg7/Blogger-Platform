import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { JWTService } from "../auth/JWTService";
import { UserService } from "../../core/services/UserService";

@injectable()
export class AuthMiddleware {
    constructor(
        @inject(JWTService) private jwtService: JWTService,
        @inject(UserService) private userService: UserService
    ) {}

    async execute(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.sendStatus(401);
            return;
        }

        const token = authHeader.split(" ")[1];
        const userId = await this.jwtService.getUserIdFromToken(token);
        if (!userId) {
            res.sendStatus(401);
            return;
        }

        const user = await this.userService.getUserById(userId);
        if (!user) {
            res.sendStatus(401);
            return;
        }

        req.user = user;
        next();
    }
}
