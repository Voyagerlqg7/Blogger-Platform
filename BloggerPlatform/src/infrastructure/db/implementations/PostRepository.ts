import {Post} from "../../../core/entities/Post";
import {IPostRepository} from "../../../core/repository/IPostRepository";
import {postsDBCollection, commentDBCollection} from "../collections/collections";
import {UpdatePostByIdDTO} from "../../../core/repository/DTO/PostDTO";
import {PostMapper} from "../mappers/PostMapper";
import {Comment} from "../../../core/entities/Comment";
import {CommentMapper} from "../mappers/CommentMapper";
import {PagedResponse, PostsQueryDTO} from "../../../core/repository/DTO/QueryParamsDTO";
import { injectable } from "inversify";

@injectable()
export class PostRepository implements IPostRepository {
    async getAllPosts(query:PostsQueryDTO): Promise<PagedResponse<Post>> {
        const filter:any = {};
        const totalCount = await postsDBCollection.countDocuments(filter);
        const items = await postsDBCollection
            .find(filter)
            .sort({ [query.sortBy]: query.sortDirection === "asc" ? 1 : -1 })
            .skip((query.pageNumber - 1) * query.pageSize)
            .limit(query.pageSize)
            .toArray();

        return {
            pagesCount: Math.ceil(totalCount / query.pageSize),
            page: query.pageNumber,
            pageSize: query.pageSize,
            totalCount,
            items: items.map(PostMapper.toDomain)
        }
    }

    async getPostById(postId: string): Promise<Post | null> {
        const post = await postsDBCollection.findOne({ _id: postId });
        if (!post) return null;
        return PostMapper.toDomain(post);
    }
    async createPost(post:Post):Promise<Post>{
        const newPost = PostMapper.toPersistence(post);
        await postsDBCollection.insertOne(newPost);
        return PostMapper.toDomain(newPost);
    }

    async deletePostById(postId: string): Promise<void> {
        await postsDBCollection.deleteOne({ _id: postId });
    }

    async updatePostById(postId: string, dto: UpdatePostByIdDTO): Promise<void> {
        await postsDBCollection.updateOne(
            { _id: postId },
            {
                $set: {
                    title: dto.title,
                    shortDescription: dto.shortDescription,
                    content: dto.content,
                    blogId: dto.blogId,
                },
            }
        );
    }

    async getAllCommentsByPostID(postId: string, query:PostsQueryDTO): Promise<PagedResponse<Comment>> {
            const filter: any = {};
            const totalCount = await commentDBCollection.countDocuments(filter);
            const items = await commentDBCollection
                .find(filter)
                .sort({[query.sortBy]: query.sortDirection === "asc" ? 1 : -1})
                .skip((query.pageNumber - 1) * query.pageSize)
                .limit(query.pageSize)
                .toArray();

            return {
                pagesCount: Math.ceil(totalCount / query.pageSize),
                page: query.pageNumber,
                pageSize: query.pageSize,
                totalCount,
                items: items.map(CommentMapper.toDomain)
            };
    }

    async createCommentByPostID(postId: string, comment: Comment): Promise<Comment> {
        const newComment = CommentMapper.toPersistence(postId, comment);
        await commentDBCollection.insertOne(newComment);
        return CommentMapper.toDomain(newComment);
    }
}

