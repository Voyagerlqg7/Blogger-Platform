import mongoose from "mongoose";
import {client} from "../connection";
import {BlogsDB, BlogSchema} from "../Schemas/BlogModel";
import {UserDB, UserSchema} from "../Schemas/UserModel";
import {PostsDB, PostSchema} from "../Schemas/PostModel";
import {CommentDB, CommentSchema, CommentLikeSchema} from "../Schemas/CommentModel";
import {session, SessionSchema} from "../Schemas/SessionModel";

export const tokenDBCollection = client.db("BloggerPlatform").collection("token");
export const requestLogsCollection = client.db("BloggerPlatform").collection("customRateLimit");

export const UserModel = mongoose.model<UserDB>("User", UserSchema);
export const BlogModel = mongoose.model<BlogsDB>("Blog", BlogSchema);
export const PostModel = mongoose.model<PostsDB>("Post", PostSchema);
export const CommentModel = mongoose.model<CommentDB>("Comment", CommentSchema);
export const SessionModel = mongoose.model<session>("Session", SessionSchema);
export const CommentLikeModel = mongoose.model("CommentLike", CommentLikeSchema)