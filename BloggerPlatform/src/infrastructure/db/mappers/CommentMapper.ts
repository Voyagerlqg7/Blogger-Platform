import {Comment} from "../../../core/entities/Comment";
import {CommentDB} from "../models/CommentModel";

export class CommentMapper{

    static toDomain(commentDB: CommentDB):Comment{
        return new Comment(
            commentDB._id.toString(),
            commentDB.content,
            {
                userId: commentDB.commentatorInfo.userId,
                userLogin: commentDB.commentatorInfo.userLogin,
            },
            commentDB.createdAt.toISOString()
        )
    }
    static toPersistence(postId: string, comment: Comment):CommentDB{
        return {
            _id: comment.id,
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin,
            },
            createdAt: new Date(comment.createdAt),
            postId: postId,
        }
    }
}