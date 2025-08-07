import {Post} from "../../../core/entities/Post";
import {IPostRepository} from "../../../core/repository/IPostRepository";
import {postsDBCollection, commentDBCollection} from "../collections/collections";
import {ObjectId} from "mongodb"
import {UpdatePostByIdDTO} from "../../../core/repository/DTO/PostDTO";
import {PostMapper} from "../mappers/PostMapper";
import {Comment} from "../../../core/entities/Comment";
import {CommentMapper} from "../mappers/CommentMapper";

export class PostRepository implements IPostRepository {
    async getAllPosts(): Promise<Post[]> {
        const posts = await postsDBCollection.find().sort({ createdAt: -1 }).toArray();
        return posts.map(PostMapper.toDomain);
    }

    async getPostById(postId: string): Promise<Post | null> {
        const post = await postsDBCollection.findOne({ _id: new ObjectId(postId) });
        if (!post) return null;
        return PostMapper.toDomain(post);
    }
    async createPost(post:Post):Promise<Post>{
        const newPost = PostMapper.toPersistence(post);
        await postsDBCollection.insertOne(newPost);
        return PostMapper.toDomain(newPost);
    }

    async deletePostById(postId: string): Promise<void> {
        await postsDBCollection.deleteOne({ _id: new ObjectId(postId) });
    }

    async updatePostById(postId: string, dto: UpdatePostByIdDTO): Promise<void> {
        await postsDBCollection.updateOne(
            { _id: new ObjectId(postId) },
            {
                $set: {
                    title: dto.title,
                    shortDescription: dto.shortDescription,
                    content: dto.content,
                    blogId: new ObjectId(dto.blogId),
                },
            }
        );
    }

    async getAllCommentsByPostID(postId: string): Promise<Comment[]> {
        const comments = await commentDBCollection
            .find({ postId: new ObjectId(postId) })
            .sort({ createdAt: -1 })
            .toArray();

        return comments.map(CommentMapper.toDomain);
    }

    async createCommentByPostID(postId: string, comment: Comment): Promise<Comment> {
        const newComment = CommentMapper.toPersistence(postId, comment);
        await commentDBCollection.insertOne(newComment);
        return CommentMapper.toDomain(newComment);
    }
}

