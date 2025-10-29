import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import {JWTService} from "./JWTService";
import {UserService} from "../../core/services/UserService";

@injectable()
export class OptionalAuthMiddleware {
    constructor(
        @inject(JWTService) private jwtService: JWTService,
        @inject(UserService) private userService: UserService
    ) {}

    async execute(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization;

        // Если нет заголовка авторизации - просто продолжаем
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            req.user = null;
            return next();
        }

        const token = authHeader.split(" ")[1];
        const userId = await this.jwtService.getUserIdFromToken(token);

        // Если токен невалидный - просто продолжаем без пользователя
        if (!userId) {
            req.user = null;
            return next();
        }

        const user = await this.userService.getUserById(userId);

        // Если пользователь не найден - продолжаем без пользователя
        if (!user) {
            req.user = null;
            return next();
        }

        req.user = user;
        next();
    }
}