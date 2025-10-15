import {Comment, CommentLike} from "../entities/Comment";

export interface ICommentsRepository {
    getCommentById(commentId:string, userId?:string):Promise<Comment | null>;
    deleteCommentById(commentId:string):Promise<void>;
    updateCommentById(commentId:string, content:string):Promise<void>;
    updateLikesCount(commentId:string, likesCount:number, dislikeCount:number):Promise<void>;
    getUserLikes(userId: string, commentIds:string[]):Promise<CommentLike[]>;
    setLike(userId:string,commentId:string,status:"Like"|"Dislike"|"None"):Promise<void>;
    countLikes(commentId:string):Promise<number>;
    countDislikes(commentId:string):Promise<number>;
}