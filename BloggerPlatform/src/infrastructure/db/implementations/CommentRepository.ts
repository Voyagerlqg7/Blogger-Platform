import {ObjectId} from 'mongodb';
import {Comment} from "../../../core/entities/Comment";
import {CommentDB} from "../models/CommentModel";
import {commentDBCollection} from "../collections/collections";

export class CommentRepository {
    async getAllCommentsByPostID(): Promise<Comment[]> {

    }

    async getCommentById(id: string): Promise<Comment | null> {
        const commentDB = await commentDBCollection.findOne({ _id: new ObjectId(id) });
        if (!commentDB) return null;
        return new Comment(
            commentDB._id.toString(),
            commentDB.content,
            {
                userId: commentDB.commentatorInfo.userId,
                userLogin: commentDB.commentatorInfo.userLogin
            },
            commentDB.createdAt.toISOString()
        )
    }
    async deleteCommentById(id: string): Promise<void | null> {
        const commentDB = commentDBCollection.findOne({ _id: new ObjectId(id) });
        if (!commentDB) return null;
        else{
            await commentDBCollection.deleteOne({ _id: new ObjectId(id) });
        }
    }
    async updateCommentById(id: string): Promise<void | null> {
        const commentDB = await commentDBCollection.findOne({ _id: new ObjectId(id) });
        if (!commentDB) return null;
        else{
            const result = await commentDBCollection.updateOne(
                { _id: new ObjectId(id) },{
                    $set: {
                        content: comment.content
                    }
                }
                )
        }
    }
    async createCommentByPostID(postId: string, comment:Comment): Promise<void> {
        const commentToSave: CommentDB = {
            _id:new ObjectId(comment.id),
            content: comment.content,
            commentatorInfo:{
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin
            },
            createdAt: new Date(comment.createdAt),
            postId: new ObjectId(postId),
        }
        await commentDBCollection.insertOne(commentToSave);
    }

}

