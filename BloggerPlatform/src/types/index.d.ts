import {UserViewModel} from "../infrastructure/db/models/UserModel";

declare global {
    namespace Express {
        interface Request {
            user: UserViewModel | null;
            refreshToken?: string;
        }
    }
}
export {};