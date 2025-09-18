import {UserViewModel} from "../core/entities/User";

declare global {
    namespace Express {
        interface Request {
            user: UserViewModel | null;
            refreshToken?: string;
            deviceId?: string;
        }
    }
}
export {};