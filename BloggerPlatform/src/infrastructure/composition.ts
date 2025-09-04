import {BlogService} from "../core/services/BlogService";
import {BlogRepository} from "./db/implementations/BlogRepository";
import {PostService} from "../core/services/PostService";
import {PostRepository} from "./db/implementations/PostRepository";
import {UserService} from "../core/services/UserService";
import {UserRepository} from "./db/implementations/UserRepository";
import {CommentService} from "../core/services/CommentService";
import {CommentRepository} from "./db/implementations/CommentRepository";
import {PasswordService} from "./applicationServices/PasswordService";

const passwordService = new PasswordService();


const blogRepository = new BlogRepository();
export const blogService = new BlogService(blogRepository);

const postRepository = new PostRepository();
export const postService = new PostService(postRepository, blogRepository);

const userRepository = new UserRepository(passwordService);
export const userService = new UserService(userRepository);

const commentRepository = new CommentRepository();
export const commentService = new CommentService(commentRepository);