import {deleteAllDevicesHandlers, deleteDevicesHandlers, getAllDevicesHandlers} from "../SecurityHTTPController";
import {Router} from "express";

const securityRoute = Router();


securityRoute.get("/", getAllDevicesHandlers);
securityRoute.delete("/:id", deleteDevicesHandlers);
securityRoute.delete("/", deleteAllDevicesHandlers);

