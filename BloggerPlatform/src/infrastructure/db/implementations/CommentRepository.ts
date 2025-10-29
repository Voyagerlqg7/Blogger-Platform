import {Comment} from "../../../core/entities/Comment";
import {CommentMapper} from "../mappers/CommentMapper";
import {ICommentsRepository} from "../../../core/repository/ICommentsRepository";
import { injectable } from "inversify";
import {CommentLike} from "../../../core/entities/Comment";
import {CommentModel, CommentLikeModel} from "../Models/collections";

@injectable()
export class CommentRepository implements ICommentsRepository {
    async getCommentById(commentId:string, userId?:string):Promise<Comment | null> {
        const comment = await CommentModel.findOne({ _id: commentId }).exec();
        if (!comment) return null;
        let myStatus: "Like" | "Dislike" | "None" = "None";
        if (userId) {
            const like = await CommentLikeModel.findOne({ userId, commentId }).lean().exec();
            if (like) {
                myStatus = like.status as "Like" | "Dislike" | "None";
            }
        }
        return CommentMapper.toDomain(comment, myStatus);
    }
    async updateCommentById(commentId:string, content: string):Promise<void> {
        await CommentModel.updateOne({_id:commentId}, {$set:{content:content}});
    }
    async deleteCommentById(commentId:string):Promise<void> {
        await CommentModel.deleteOne({_id:commentId});
    }
    async updateLikesCount(commentId:string, likesCount:number, dislikesCount:number):Promise<void> {
        await CommentModel.updateOne(
            { _id: commentId },
            { $set: { likesCount, dislikesCount } }
        );

    }
    async getUserLikes(userId: string, commentIds: string[]): Promise<CommentLike[]> {
        const docs = await CommentLikeModel.find({ userId, commentId: { $in: commentIds } })
            .lean()
            .exec();

        return docs.map(d =>
            new CommentLike(
                String(d.userId),
                String(d.commentId),
                d.status as "Like" | "Dislike",
                d.createdAt instanceof Date ? d.createdAt.toISOString() : String(d.createdAt)
            )
        );

    }
    async setLike(userId: string, commentId: string, status: "Like" | "Dislike" | "None"): Promise<void> {
        if (status === "None") {
            await CommentLikeModel.deleteOne({ userId, commentId });
            return;
        }

        await CommentLikeModel.findOneAndUpdate(
            { userId, commentId },
            { userId, commentId, status, createdAt: new Date() },
            { upsert: true, new: true }
        );

    }

    async countLikes(commentId:string):Promise<number> {
        return CommentLikeModel.countDocuments({commentId, status:"Like"});
    }
    async countDislikes(commentId:string):Promise<number> {
        return CommentLikeModel.countDocuments({commentId, status:"Dislike"});

    }

}