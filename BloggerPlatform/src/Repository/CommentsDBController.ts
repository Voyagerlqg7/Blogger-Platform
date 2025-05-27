import {client} from "../mongo/ConnectDB";
import {CommentDB, CommentViewModel} from "../Objects/Comments";
import {ObjectId} from "mongodb";

export const CommentsDBCollection = client.db("BloggerPlatform").collection<CommentDB>("Comments");

export const CommentsDBController = {
    async GetCommentById(commentId:string):Promise<CommentViewModel | undefined>{
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
    async UpdateCommentText(commentId: string, newText: string): Promise<CommentViewModel | undefined> {
        if (!ObjectId.isValid(commentId)) return undefined;

        const filter = { _id: new ObjectId(commentId) };
        const update = { $set: { content: newText } };

        try {
            const result = await CommentsDBCollection.updateOne(filter, update);
            if (result.modifiedCount === 0) return undefined;
            const updated = await CommentsDBCollection.findOne(filter);
            if (!updated) return undefined;

            return {
                id: updated._id.toString(),
                content: updated.content,
                commentatorInfo: {
                    userId: updated.commentatorInfo.userId,
                    userLogin: updated.commentatorInfo.userLogin
                },
                createdAt: updated.createdAt
            };
        } catch (err) {
            console.error("Error updating comment:", err);
            return undefined;
        }
    },
    async DeleteCommentById(commentId: string): Promise<boolean> {
        if (!ObjectId.isValid(commentId)) return false;
        try {
            const result = await CommentsDBCollection.deleteOne({ _id: new ObjectId(commentId) });
            return result.deletedCount > 0;
        } catch (error) {
            console.error("Error deleting comment by ID:", error);
            throw new Error("Failed to delete comment");
        }
    }

};