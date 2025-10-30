import mongoose from "mongoose";
import {BlogsDB, BlogSchema} from "../Schemas/BlogModel";
import {UserDB, UserSchema} from "../Schemas/UserModel";
import {PostsDB, PostSchema, PostLikeSchema} from "../Schemas/PostModel";
import {CommentDB, CommentSchema, CommentLikeSchema} from "../Schemas/CommentModel";
import {session, SessionSchema} from "../Schemas/SessionModel";
import {TokenSchema} from "../Schemas/TokenModel";
import {RequestLogSchema} from "../Schemas/RequestLogModel";

export const TokenModel = mongoose.model("Token", TokenSchema)
export const RequestLogsModel = mongoose.model("CustomRateLimit", RequestLogSchema)
export const UserModel = mongoose.model<UserDB>("User", UserSchema);
export const BlogModel = mongoose.model<BlogsDB>("Blog", BlogSchema);
export const PostModel = mongoose.model<PostsDB>("Post", PostSchema);
export const CommentModel = mongoose.model<CommentDB>("Comment", CommentSchema);
export const SessionModel = mongoose.model<session>("Session", SessionSchema);
export const CommentLikeModel = mongoose.model("CommentLike", CommentLikeSchema);
export const PostLikeModel = mongoose.model("PostLike", PostLikeSchema)