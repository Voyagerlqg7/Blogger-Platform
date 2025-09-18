import {Response, Request} from "express";
import {sessionsRepository} from "../db/implementations/SessionsRepository";

export const getAllDevicesHandlers = async (req: Request, res:Response) => {
    const sessions = await sessionsRepository.findByUserId(req.user!.id);
    res.send(sessions.map(s =>(
        {
            ip: s.ip,
            title: s.title,
            lastActiveDate: s.lastActiveDate,
            deviceId:s.deviceId,
        }
    )));


}


export const deleteAllDevicesHandlers = async (req: Request, res:Response) => {
    await sessionsRepository.deleteAllExcept(req.user!.id, req.deviceId!);
    res.sendStatus(204);
}

export const deleteDevicesHandlers = async (req: Request, res:Response) => {
    const session = await sessionsRepository.findByDeviceId(req.params.id);
    if (!session) {res.sendStatus(404); return}
    if (session.userId !== req.user!.id) {res.sendStatus(403); return;}

    await sessionsRepository.deleteDeviceById(req.params.id);
    res.sendStatus(204);
}