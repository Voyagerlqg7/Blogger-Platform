import {Request, Response} from 'express';
import {userService} from "../composition";


export const getAllUsers = async (req: Request, res: Response) => {
    res.status(200).json(await userService.getAllUsers());
}

export const getUserById = async (req: Request, res: Response) => {
    const user = userService.getUserById(req.params.id);
    if (!user) {res.status(404).send("User not found!");}
    else{res.status(200).json(user);}
}
export const deleteUserById = async (req: Request, res: Response) => {
    const user = userService.getUserById(req.params.id);
    if(!user){res.status(404).send("user not found!");}
    else{
        await userService.deleteUser(req.params.id);
        res.status(200).send();
    }
}

export const createNewUser = async (req: Request, res: Response) => {
    //to be continued
}