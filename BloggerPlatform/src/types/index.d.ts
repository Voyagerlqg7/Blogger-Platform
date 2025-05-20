import {UserDBType} from "../Objects/User";
//index.d.ts
declare global {
    namespace Express {
        export interface Request {
            userId: UserDBType | null
        }
    }
}
