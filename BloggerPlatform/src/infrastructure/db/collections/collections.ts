import {client} from "../connection"
import {BlogsDB} from "../models/BlogModel";
import {UserDB} from "../models/UserModel";
import {PostsDB} from "../models/PostModel";
import {CommentDB} from "../models/CommentModel";

export const blogsDBCollection = client.db("BloggerPlatform").collection<BlogsDB>("blogs");
export const userDBCollection = client.db("BloggerPlatform").collection<UserDB>("users");
export const commentDBCollection = client.db("BloggerPlatform").collection<CommentDB>("Comments");
export const postsDBCollection = client.db("BloggerPlatform").collection<PostsDB>("posts");
export const tokenDBCollection = client.db("BloggerPlatform").collection("token");
export const requestLogsCollection = client.db("BloggerPlatform").collection("customRateLimit");