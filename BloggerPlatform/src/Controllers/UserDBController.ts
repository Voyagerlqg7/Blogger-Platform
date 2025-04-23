import { client } from "../mongo/ConnectDB";
import {User} from  '../Objects/User'
import {ObjectId} from "mongodb";

export const userDBcollection = client.db("BloggerPlatform").collection<User>("users");

export const UsersDBController = {

}