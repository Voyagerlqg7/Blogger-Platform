import {Post, PostLike} from "../../../core/entities/Post";
import {IPostRepository} from "../../../core/repository/IPostRepository";
import {UpdatePostByIdDTO} from "../../../core/repository/DTO/PostDTO";
import {PostMapper} from "../mappers/PostMapper";
import {Comment} from "../../../core/entities/Comment";
import {CommentMapper} from "../mappers/CommentMapper";
import {PagedResponse, PostsQueryDTO} from "../../../core/repository/DTO/QueryParamsDTO";
import {injectable} from "inversify";
import {PostModel, CommentModel, CommentLikeModel, PostLikeModel} from "../Models/collections";

@injectable()
export class PostRepository implements IPostRepository {
    async getAllPosts(query: PostsQueryDTO): Promise<PagedResponse<Post>> {
        const filter: any = {};
        const totalCount = await PostModel.countDocuments(filter);
        const items = await PostModel
            .find(filter)
            .sort({[query.sortBy]: query.sortDirection === "asc" ? 1 : -1})
            .skip((query.pageNumber - 1) * query.pageSize)
            .limit(query.pageSize)
            .lean();

        return {
            pagesCount: Math.ceil(totalCount / query.pageSize),
            page: query.pageNumber,
            pageSize: query.pageSize,
            totalCount,
            items: items.map(PostMapper.toDomain)
        }
    }

    async getPostById(postId: string): Promise<Post | null> {
        const post = await PostModel.findOne({_id: postId});
        if (!post) return null;
        return PostMapper.toDomain(post);
    }

    async createPost(post: Post): Promise<Post> {
        const newPost = PostMapper.toPersistence(post);
        await PostModel.insertOne(newPost);
        return PostMapper.toDomain(newPost);
    }

    async deletePostById(postId: string): Promise<void> {
        await PostModel.deleteOne({_id: postId});
    }

    async updatePostById(postId: string, dto: UpdatePostByIdDTO): Promise<void> {
        await PostModel.updateOne(
            {_id: postId},
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

    async getAllCommentsByPostID(postId:string,query: PostsQueryDTO, userId: string): Promise<PagedResponse<Comment>> {
        const filter: any = {postId};
        const totalCount = await CommentModel.countDocuments(filter);
        const items = await CommentModel
            .find(filter)
            .sort({[query.sortBy]: query.sortDirection === "asc" ? 1 : -1})
            .skip((query.pageNumber - 1) * query.pageSize)
            .limit(query.pageSize)
            .lean();

        let userLikes: Record<string, "Like" | "Dislike"> = {};
        if (userId) {
            const likes = await CommentLikeModel.find({
                userId,
                commentId: { $in: items.map(i => i._id) }
            }).lean();

            userLikes = likes.reduce((acc, l) => {
                acc[String(l.commentId)] = l.status as "Like" | "Dislike";
                return acc;
            }, {} as Record<string, "Like" | "Dislike">);

        }
        const domainItems = items.map(i =>
            CommentMapper.toDomain(i, userLikes[i._id.toString()] || "None")
        );
        return {
            pagesCount: Math.ceil(totalCount / query.pageSize),
            page: query.pageNumber,
            pageSize: query.pageSize,
            totalCount,
            items: domainItems
        };
    }

    async createCommentByPostID(postId: string, comment: Comment): Promise<Comment> {
        const newComment = CommentMapper.toPersistence(postId, comment);
        await CommentModel.insertOne(newComment);
        return CommentMapper.toDomain(newComment,"None");
    }


    async updateLikesCount(postId:string, likesCount:number, dislikesCount:number):Promise<void> {
        await PostModel.updateOne(
            { _id: postId },
            { $set: { likesCount, dislikesCount } }
        );

    }
    async getUserLikes(userId: string, postIds: string[]): Promise<PostLike[]> {
        const docs = await PostLikeModel.find({ userId, postId: { $in: postIds } })
            .lean()
            .exec();

        return docs.map(d =>
            new PostLike(
                String(d.userId),
                String(d.postId),
                d.status as "Like" | "Dislike",
                d.createdAt instanceof Date ? d.createdAt.toISOString() : String(d.createdAt)
            )
        );

    }

    async setLike(userId: string, postId: string, status: "Like" | "Dislike" | "None"): Promise<void> {
        if (status === "None") {
            await PostLikeModel.deleteOne({ userId, postId });
            return;
        }

        await PostLikeModel.findOneAndUpdate(
            { userId, postId },
            { userId, postId, status, createdAt: new Date() },
            { upsert: true, new: true }
        );

    }
    async countLikes(postId:string):Promise<number> {
        return PostLikeModel.countDocuments({postId, status:"Like"});
    }
    async countDislikes(postId:string):Promise<number> {
        return PostLikeModel.countDocuments({postId, status:"Dislike"});
    }
}

