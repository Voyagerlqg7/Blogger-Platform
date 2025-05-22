import {client} from "../mongo/ConnectDB";
import {CommentDB} from "../Objects/Comments";
import {ObjectId} from "mongodb";

export const CommentsDBCollection = client.db("BloggerPlatform").collection<CommentDB>("Comments");

export const CommentsDBController = {
    async GetCommentById(commentId:string):Promise<CommentDB | undefined>{
        if (!ObjectId.isValid(commentId)) return undefined;
        try{
            const comment = await CommentsDBCollection.findOne({_id: new ObjectId(commentId)});
            if(!comment) return undefined;
            return{
              id: comment._id.toString(),
              content: comment.content,
              commentatorInfo: {
                  userId: comment.commentatorInfo.userId,
                  userLogin: comment.commentatorInfo.userLogin
              },
              createdAt: comment.createdAt
            };
        }
        catch(err){
            console.error(err);
            console.log("Error getting comment");
            return undefined;
        }

    },
    async UpdateCommentById(commentId:string, NewText:string):Promise<CommentDB| undefined>{
        if (!ObjectId.isValid(commentId)) return undefined;
        try{
            const UpdateComment = await CommentsDBCollection.findOne({_id: new ObjectId(commentId)});
            if(!UpdateComment) return undefined;
            return UpdateComment?{
                id: UpdateComment._id.toString(),
                content: NewText,
                commentatorInfo: {
                    userId: UpdateComment.commentatorInfo.userId,
                    userLogin: UpdateComment.commentatorInfo.userLogin,
                },
                createdAt: UpdateComment.createdAt
            }:undefined;
        } catch(err){
            console.error(err);
            throw new Error("Failed to update blog");
        }
    },
    async DeleteCommentById(commentId:string){
        if (!commentId) return false;
        try {
            const result = await CommentsDBCollection.deleteOne({ _id: new ObjectId(commentId) });
            return result.deletedCount > 0;
        } catch (error) {
            console.error("Error deleting comment by ID:", error);
            throw new Error("Failed to delete comment");
        }
    }
};