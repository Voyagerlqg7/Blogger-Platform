import {Post} from "../../../core/entities/Post";
import {IPostRepository} from "../../../core/repository/IPostRepository";
import {postsDBCollection, commentDBCollection} from "../collections/collections";
import {ObjectId} from "mongodb"
import {UpdatePostByIdDTO} from "../../../core/repository/DTO/PostDTO";
import {PostMapper} from "../mappers/PostMapper";
import {Comment} from "../../../core/entities/Comment";
import {CommentMapper} from "../mappers/CommentMapper";
import {CommentDB} from "../models/CommentModel";

export class PostRepository implements IPostRepository {
    async getAllPosts(): Promise<Post[]> {

    }
    async getPostById(postId:string):Promise<Post | null> {
        const post = await postsDBCollection.findOne({_id: new ObjectId(postId)});
        if (!post) {
            return null;
        }
        return PostMapper.toDomain(post);
    }
    async deletePostById(postId:string):Promise<void> {
        await postsDBCollection.deleteOne({_id:new ObjectId(postId)});
    }
    async updatePostById(postId:string, dto:UpdatePostByIdDTO):Promise<void>{
        await postsDBCollection.updateOne({_id: new ObjectId(postId)},
            {$set: {title:dto.title, shortDescription:dto.shortDescription, content:dto.content, blogId: dto.blogId}});
    }
    async getAllCommentsByPostID(postId:string):Promise<Comment[]>{

    }
    async createCommentByPostID(postId:string, comment:Comment):Promise<Comment>{
        const newComment = CommentMapper.toPersistence(postId, comment);
        await commentDBCollection.insertOne(newComment);
        return CommentMapper.toDomain(newComment);
    }


}
