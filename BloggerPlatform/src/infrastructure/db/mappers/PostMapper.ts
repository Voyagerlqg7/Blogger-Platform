import {Post} from "../../../core/entities/Post";
import {PostsDB} from "../models/PostModel";
import {ObjectId} from "mongodb"

export class PostMapper{
    static toDomain(postDB: PostsDB):Post{
        return new Post(
            postDB._id.toString(),
            postDB.title,
            postDB.content,
            postDB.shortDescription,
            postDB.blogId,
            postDB.blogName,
            postDB.createdAt.toISOString()
        )
    }
    static toPersistence(post: Post):PostsDB{
        return{
            _id: new ObjectId(post.id),
            title: post.title,
            content: post.content,
            shortDescription: post.shortDescription,
            blogId: post.blogId,
            blogName:post.blogName,
            createdAt: new Date(post.createdAt),
        }
    }
}