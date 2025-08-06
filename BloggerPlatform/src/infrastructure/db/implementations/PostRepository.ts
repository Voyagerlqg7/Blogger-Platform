import {Post} from "../../../core/entities/Post";
import {IPostRepository} from "../../../core/repository/IPostRepository";
import {postsDBCollection} from "../collections/collections";
import {ObjectId} from "mongodb"
import {UpdatePostByIdDTO} from "../../../core/repository/DTO/PostDTO";
import {PostMapper} from "../mappers/PostMapper";

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
    async createPostByBlogId(post:Post){
        const newPost = PostMapper.toPersistence(post);
        await postsDBCollection.insertOne(newPost);
        return PostMapper.toDomain(newPost);
    }
    async getAllPostsByBlogId(blogId:string):Promise<Post[]> {

    }

}
