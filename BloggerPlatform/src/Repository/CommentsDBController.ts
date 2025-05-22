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
            else{
                return UpdateComment?{
                    id: UpdateComment.id,
                }
            }
        }
        catch(err){

        }

    },
    async DeleteCommentById(commentsId:string){

    }
};