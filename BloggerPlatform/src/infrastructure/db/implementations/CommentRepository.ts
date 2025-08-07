import {commentDBCollection} from "../collections/collections";
import {ObjectId} from "mongodb";
import {Comment} from "../../../core/entities/Comment";
import {CommentMapper} from "../mappers/CommentMapper";
import {ICommentsRepository} from "../../../core/repository/ICommentsRepository";


export class CommentRepository implements ICommentsRepository {
    async getAllCommentsByPostID(postId: string): Promise<Comment[]> {
        const comments = await commentDBCollection
            .find({ postId: new ObjectId(postId) })
            .sort({ createdAt: -1 })
            .toArray();

        return comments.map(CommentMapper.toDomain);
    }
    async getCommentById(commentId:string):Promise<Comment | null> {
        const comment = await commentDBCollection.findOne({_id:new ObjectId(commentId)});
        if (!comment) {
            return null;
        }
        return CommentMapper.toDomain(comment);
    }
    async createCommentByPostID(postId:string, comment:Comment):Promise<Comment | null> {
        const newComment = CommentMapper.toPersistence(postId, comment);
        await commentDBCollection.insertOne(newComment);
        return CommentMapper.toDomain(newComment);
    }
    async updateCommentById(commentId:string, content: string):Promise<void> {
        await commentDBCollection.updateOne({_id:new ObjectId(commentId)}, {$set:{content:content}});
    }
    async deleteCommentById(commentId:string):Promise<void> {
        await commentDBCollection.deleteOne({_id:new ObjectId(commentId)});
    }
}