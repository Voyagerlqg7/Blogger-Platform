import {commentDBCollection} from "../collections/collections";
import {ObjectId} from "mongodb";
import {Comment} from "../../../core/entities/Comment";
import {CommentMapper} from "../mappers/CommentMapper";
import {ICommentsRepository} from "../../../core/repository/ICommentsRepository";


export class CommentRepository implements ICommentsRepository {
    async getCommentById(commentId:string):Promise<Comment | null> {
        const comment = await commentDBCollection.findOne({_id:commentId});
        if (!comment) {
            return null;
        }
        return CommentMapper.toDomain(comment);
    }
    async updateCommentById(commentId:string, content: string):Promise<void> {
        await commentDBCollection.updateOne({_id:commentId}, {$set:{content:content}});
    }
    async deleteCommentById(commentId:string):Promise<void> {
        await commentDBCollection.deleteOne({_id:commentId});
    }
}