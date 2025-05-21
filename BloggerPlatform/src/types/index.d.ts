import {UserDBType} from "../Objects/User";

declare global {
    namespace Express {
        interface Request {
            user: UserDBType | null;
        }
    }
}
export {};