import {UserViewModel} from "../Objects/User";

declare global {
    namespace Express {
        interface Request {
            user: UserViewModel | null;
        }
    }
}
export {};