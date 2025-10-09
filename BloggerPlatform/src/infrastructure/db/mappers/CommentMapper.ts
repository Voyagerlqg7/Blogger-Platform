import { Comment } from "../../../core/entities/Comment";
import { CommentDB } from "../Schemas/CommentModel";

export class CommentMapper {

    static toDomain(commentDB: CommentDB): Comment {
        return new Comment(
            commentDB._id.toString(),
            commentDB.content,
            {
                userId: commentDB.commentatorInfo.userId,
                userLogin: commentDB.commentatorInfo.userLogin,
            },
            commentDB.createdAt.toISOString(),
            {
                likesCount: commentDB.likesCount,
                dislikesCount: commentDB.dislikesCount,
                myStatus: "None",
            }
        );
    }
    static toPersistence(postId: string, comment: Comment): CommentDB {
        return {
            _id: comment.id,
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin,
            },
            createdAt: new Date(comment.createdAt),
            postId: postId,
            likesCount: comment.likesInfo.likesCount,
            dislikesCount: comment.likesInfo.dislikesCount,
        };
    }
}