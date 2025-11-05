import mongoose from "mongoose";
import {BlogsDB, BlogSchema} from "../Schemas/BlogSchema";
import {UserDB, UserSchema} from "../Schemas/UserSchema";
import {PostsDB, PostSchema, PostLikeSchema} from "../Schemas/PostSchema";
import {CommentDB, CommentSchema, CommentLikeSchema} from "../Schemas/CommentSchema";
import {session, SessionSchema} from "../Schemas/SessionSchema";
import {TokenSchema} from "../Schemas/TokenSchema";
import {RequestLogSchema} from "../Schemas/RequestLogsSchema";

export const TokenModel = mongoose.model("Token", TokenSchema)
export const RequestLogsModel = mongoose.model("CustomRateLimit", RequestLogSchema)
export const UserModel = mongoose.model<UserDB>("User", UserSchema);
export const BlogModel = mongoose.model<BlogsDB>("Blog", BlogSchema);
export const PostModel = mongoose.model<PostsDB>("Post", PostSchema);
export const CommentModel = mongoose.model<CommentDB>("Comment", CommentSchema);
export const SessionModel = mongoose.model<session>("Session", SessionSchema);
export const CommentLikeModel = mongoose.model("CommentLike", CommentLikeSchema);
export const PostLikeModel = mongoose.model("PostLike", PostLikeSchema)