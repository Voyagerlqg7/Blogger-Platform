import {Response, Request} from "express";
import {sessionsRepository} from "../db/implementations/SessionsRepository";
import {injectable, inject} from "inversify";


@injectable()
export class SecurityHTTPController {
    constructor(@inject(sessionsRepository) private sessionRepository:sessionsRepository) {
    }
    getAllDevicesHandlers = async (req: Request, res: Response) => {
        const sessions = await this.sessionRepository.findByUserId(req.user!.id);
        res.send(sessions.map(s => (
            {
                ip: s.ip,
                title: s.title,
                lastActiveDate: s.lastActiveDate,
                deviceId: s.deviceId,
            }
        )));
    }
    deleteAllDevicesHandlers = async (req: Request, res: Response) => {
        await this.sessionRepository.deleteAllExcept(req.user!.id, req.deviceId!);
        res.sendStatus(204);
    }
    deleteDevicesHandlers = async (req: Request, res: Response) => {
        const session = await this.sessionRepository.findByDeviceId(req.params.id);
        if (!session) {
            res.sendStatus(404);
            return
        }
        if (session.userId !== req.user!.id) {
            res.sendStatus(403);
            return;
        }

        await this.sessionRepository.deleteDeviceById(req.params.id);
        res.sendStatus(204);
    }
}