import "reflect-metadata";
import { Container } from "inversify";

// Интерфейсы репозитория
import {IUserRepository} from "../core/repository/IUserRepository";
import {IBlogRepository} from "../core/repository/IBlogRepository";
import {IPostRepository} from "../core/repository/IPostRepository";
import {ICommentsRepository} from "../core/repository/ICommentsRepository";

// Реализации интерфейсов
import {BlogRepository} from "./db/implementations/BlogRepository";
import {PostRepository} from "./db/implementations/PostRepository";
import {UserRepository} from "./db/implementations/UserRepository";
import {CommentRepository} from "./db/implementations/CommentRepository";

// Сервисы сущностей
import {UserService} from "../core/services/UserService";
import {BlogService} from "../core/services/BlogService";
import {CommentService} from "../core/services/CommentService";
import {PostService} from "../core/services/PostService";

//Сервисы приложения
import {PasswordService} from "./applicationServices/PasswordService";
import {JWTService} from "./auth/JWTService";
import {EmailService} from "./applicationServices/EmailService";
import {UserConfirmationService} from "./applicationServices/UserConfirmationService";
import {AuthController} from "./controllers/AuthHTTPController";
import {AuthMiddleware} from "./auth/AuthMiddleware";


// Репозитории
import {TokenRepository} from "./db/implementations/TokenRepository";
import {SessionsRepository} from "./db/implementations/SessionsRepository";

const container = new Container();

// Репозитории
container.bind<IUserRepository>("IUserRepository").to(UserRepository);
container.bind<IBlogRepository>("IBlogRepository").to(BlogRepository);
container.bind<IPostRepository>("IPostRepository").to(PostRepository);
container.bind<ICommentsRepository>("ICommentsRepository").to(CommentRepository);
container.bind<TokenRepository>(TokenRepository).toSelf().inSingletonScope();
container.bind<SessionsRepository>(SessionsRepository).toSelf().inSingletonScope();

// Сервисы
container.bind<AuthMiddleware>(AuthMiddleware).toSelf().inSingletonScope();
container.bind<AuthController>(AuthController).toSelf().inSingletonScope();
container.bind<UserService>(UserService).toSelf().inSingletonScope();
container.bind<BlogService>(BlogService).toSelf().inSingletonScope();
container.bind<CommentService>(CommentService).toSelf().inSingletonScope();
container.bind<PostService>(PostService).toSelf().inSingletonScope();
container.bind<PasswordService>(PasswordService).toSelf().inSingletonScope();
container.bind<JWTService>(JWTService).toSelf().inSingletonScope();
container.bind<EmailService>(EmailService).toSelf().inSingletonScope();
container.bind<UserConfirmationService>(UserConfirmationService).toSelf().inSingletonScope();

export { container };