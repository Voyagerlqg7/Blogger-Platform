import {UserViewModel} from "../Objects/User";

declare global {
    namespace Express {
        interface Request {
            user: UserViewModel | null;
            refreshToken?: string;
        }
    }
}
export {};