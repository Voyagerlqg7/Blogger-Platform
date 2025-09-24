import {Router} from "express";
import {createValidateRefreshToken} from "../../middlewares/validateRefToken";
import {SecurityHTTPController} from "../SecurityHTTPController"
import {container} from "../../composition";

export const securityDevicesRouter = Router();
const securityController = container.get<SecurityHTTPController>(SecurityHTTPController);

securityDevicesRouter.get("/", createValidateRefreshToken(),securityController.getAllDevicesHandlers);
securityDevicesRouter.delete("/:id", createValidateRefreshToken(), securityController.deleteDevicesHandlers);
securityDevicesRouter.delete("/", createValidateRefreshToken(), securityController.deleteAllDevicesHandlers);