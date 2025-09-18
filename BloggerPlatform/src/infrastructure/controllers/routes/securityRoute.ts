import {deleteAllDevicesHandlers, deleteDevicesHandlers, getAllDevicesHandlers} from "../SecurityHTTPController";
import {Router} from "express";
import {validateRefreshToken} from "../../middlewares/validateRefToken";

export const securityDevicesRouter = Router();


securityDevicesRouter.get("/", validateRefreshToken,getAllDevicesHandlers);
securityDevicesRouter.delete("/:id", validateRefreshToken, deleteDevicesHandlers);
securityDevicesRouter.delete("/", validateRefreshToken, deleteAllDevicesHandlers);