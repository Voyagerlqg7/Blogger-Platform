import {Post} from "../../../core/entities/Post";
import {PostsDB} from "../Schemas/PostModel";

export class PostMapper{
    static toDomain(postDB: PostsDB, status: "Like" | "Dislike" | "None"):Post{
        return new Post(
            postDB._id.toString(),
            postDB.title,
            postDB.content,
            postDB.shortDescription,
            postDB.blogId.toString(),
            postDB.blogName,
            postDB.createdAt.toISOString(),
            {
                likesCount:postDB.likesCount,
                dislikesCount:postDB.dislikesCount,
                myStatus: status,
            }
        )
    }
    static toPersistence(post: Post):PostsDB{
        return{
            _id: post.id,
            title: post.title,
            content: post.content,
            shortDescription: post.shortDescription,
            blogId: post.blogId,
            blogName:post.blogName,
            createdAt: new Date(post.createdAt),
            likesCount: post.likesInfo.likesCount,
            dislikesCount: post.likesInfo.dislikesCount,
        }
    }
}