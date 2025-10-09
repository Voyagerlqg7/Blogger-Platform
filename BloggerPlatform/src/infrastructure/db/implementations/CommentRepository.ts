import {Comment} from "../../../core/entities/Comment";
import {CommentMapper} from "../mappers/CommentMapper";
import {ICommentsRepository} from "../../../core/repository/ICommentsRepository";
import { injectable } from "inversify";
import {CommentModel} from "../Models/collections";

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
}