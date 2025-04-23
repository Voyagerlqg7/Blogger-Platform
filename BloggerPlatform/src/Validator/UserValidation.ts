import {body, ValidationChain} from "express-validator";
import {client} from "../mongo/ConnectDB";
import {ObjectId} from "mongodb";

//const usersDBCollection = client.db("BloggerPlatform").collection("users");

export const usersValidationMiddleware : ValidationChain[] = [

]