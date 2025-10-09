import {client} from "../connection"
import {BlogsDB} from "../Schemas/BlogModel";
import {UserDB} from "../Schemas/UserModel";
import {PostsDB} from "../Schemas/PostModel";
import {CommentDB} from "../Schemas/CommentModel";


export const sessionDBCollection = client.db("BloggerPlatform").collection("sessions");
export const blogsDBCollection = client.db("BloggerPlatform").collection<BlogsDB>("blogs");
export const userDBCollection = client.db("BloggerPlatform").collection<UserDB>("users");
export const commentDBCollection = client.db("BloggerPlatform").collection<CommentDB>("Comments");
export const postsDBCollection = client.db("BloggerPlatform").collection<PostsDB>("posts");
export const tokenDBCollection = client.db("BloggerPlatform").collection("token");
export const requestLogsCollection = client.db("BloggerPlatform").collection("customRateLimit");