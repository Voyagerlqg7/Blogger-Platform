import {Request, Response, Router} from 'express';
import {UserService} from "../Domain/UserService";
import {JWTService} from "../application/JWTService";
import {AuthMiddleware} from "../Authorization/AuthMiddleware";
import {inputValidationMiddleware} from "../Validator/input-validation-middleware";
export const AuthRouter = Router();

AuthRouter.post('/login', inputValidationMiddleware, async (request:Request, response:Response) => {
    const user = await UserService.checkCredentials(request.body.loginOrEmail, request.body.password);
    if(user){
        const token = await JWTService.createJWT(user);
        response.status(200).json({ accessToken: token });
    }
    else{response.status(401).send();}
})
AuthRouter.get('/me', AuthMiddleware, async (req: Request, res: Response) => {
    const user = req.user!;
    res.status(200).json({
        email: user.email,
        login: user.login,
        userId: user._id
    });
});
