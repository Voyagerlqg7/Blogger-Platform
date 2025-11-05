import { Comment } from "../../../core/entities/Comment";
import { CommentDB } from "../Schemas/CommentSchema";

export class CommentMapper {

    static toDomain(commentDB: CommentDB, status: "Like" | "Dislike" | "None"): Comment {
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
                myStatus: status,
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