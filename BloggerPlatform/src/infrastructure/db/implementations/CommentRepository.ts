import {Comment} from "../../../core/entities/Comment";
import {CommentMapper} from "../mappers/CommentMapper";
import {ICommentsRepository} from "../../../core/repository/ICommentsRepository";
import { injectable } from "inversify";
import {CommentLike} from "../../../core/entities/Comment";
import {CommentModel, CommentLikeModel} from "../Models/collections";

@injectable()
export class CommentRepository implements ICommentsRepository {
    async getCommentById(commentId:string):Promise<Comment | null> {
        const comment = await CommentModel.findOne({_id:commentId});
        if (!comment) {
            return null;
        }
        return CommentMapper.toDomain(comment);
    }
    async updateCommentById(commentId:string, content: string):Promise<void> {
        await CommentModel.updateOne({_id:commentId}, {$set:{content:content}});
    }
    async deleteCommentById(commentId:string):Promise<void> {
        await CommentModel.deleteOne({_id:commentId});
    }
    async updateLikesCount(commentId:string, likesCount:number, dislikesCount:number):Promise<void> {
        await CommentModel.updateOne({_id:commentId},{likesCount,dislikesCount});
    }
    async getUserLikes(userId: string, commentIds: string[]): Promise<CommentLike[]> {
        const docs = await CommentLikeModel.find({ userId, commentId: { $in: commentIds } })
            .lean<CommentLike[]>()
            .exec();

        return docs.map(d =>
            new CommentLike(
                d.userId as string,
                d.commentId as string,
                d.status as "Like" | "Dislike",
                d.createdAt
            )
        );




    }
    async setLike(userId:string,commentId:string, status:"Like"|"Dislike"):Promise<void> {
        await CommentLikeModel.updateOne(
            { userId, commentId },
            { userId, commentId, status, createdAt: new Date() },
            { upsert: true }
        );
    }
    async countLikes(commentId:string):Promise<number> {
        return CommentLikeModel.countDocuments({commentId, status:"Like"});
    }
    async countDislikes(commentId:string):Promise<number> {
        return CommentLikeModel.countDocuments({commentId, status:"Dislike"});

    }

}