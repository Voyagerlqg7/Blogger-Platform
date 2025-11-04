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
    async getAllPosts(query: PostsQueryDTO,userId?: string): Promise<PagedResponse<Post>> {
        const filter: any = {};
        const totalCount = await PostModel.countDocuments(filter);
        const items = await PostModel
            .find(filter)
            .sort({ [query.sortBy]: query.sortDirection === "asc" ? 1 : -1 })
            .skip((query.pageNumber - 1) * query.pageSize)
            .limit(query.pageSize)
            .lean();
        let userLikes: Record<string, "Like" | "Dislike"> = {};
        if (userId) {
            const likes = await PostLikeModel.find({
                userId,
                postId: { $in: items.map(i => i._id) }
            }).lean();

            userLikes = likes.reduce((acc, l) => {
                acc[String(l.postId)] = l.status as "Like" | "Dislike";
                return acc;
            }, {} as Record<string, "Like" | "Dislike">);
        }

        const postIds = items.map(i => i._id);
        const allNewestLikes = await PostLikeModel.aggregate([
            { $match: { postId: { $in: postIds }, status: "Like" } },
            { $sort: { createdAt: -1 } },
            {
                $group: {
                    _id: "$postId",
                    likes: {
                        $push: {
                            addedAt: "$createdAt",
                            userId: "$userId",
                            login: "$login"
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    likes: { $slice: ["$likes", 3] } // берём только 3 последних
                }
            }
        ]);

        const newestLikesMap: Record<string, { addedAt: string; userId: string; login: string }[]> = {};
        allNewestLikes.forEach(likeGroup => {
            newestLikesMap[String(likeGroup._id)] = likeGroup.likes.map((l: any) => ({
                addedAt: new Date(l.addedAt).toISOString(),
                userId: l.userId,
                login: l.login
            }));
        });

        const domainItems = items.map(i =>
            PostMapper.toDomain(
                i,
                userLikes[i._id.toString()] || "None",
                newestLikesMap[i._id.toString()] || []
            )
        );

        return {
            pagesCount: Math.ceil(totalCount / query.pageSize),
            page: query.pageNumber,
            pageSize: query.pageSize,
            totalCount,
            items: domainItems
        };
    }


    async getPostById(postId: string, userId?: string): Promise<Post | null> {
        const post = await PostModel.findOne({ _id: postId }).lean().exec();
        if (!post) return null;

        let myStatus: "Like" | "Dislike" | "None"= "None";
        if (userId) {
            const like = await PostLikeModel.findOne({ userId, postId }).lean().exec();
            if (like) {
                myStatus = like.status as "Like" | "Dislike" | "None";
            }
        }

        // последние 3 лайка
        const newestLikes = await PostLikeModel.find({ postId, status: "Like" })
            .sort({ createdAt: -1 })
            .limit(3)
            .select({ createdAt: 1, userId: 1, login: 1, _id: 0 })
            .lean();

        const formattedLikes = newestLikes.map(l => ({
            addedAt: new Date(l.createdAt).toISOString(),
            userId: l.userId,
            login: l.login
        }));


        return PostMapper.toDomain(post, myStatus, formattedLikes);
    }


    async createPost(post: Post): Promise<Post> {
        const newPost = PostMapper.toPersistence(post);
        await PostModel.create(newPost);
        return PostMapper.toDomain(newPost, "None");
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
                String(d.login),
                d.status as "Like" | "Dislike",
                d.createdAt instanceof Date ? d.createdAt.toISOString() : String(d.createdAt)
            )
        );

    }

    async setLike(
        userId: string,
        postId: string,
        login: string,
        status: "Like" | "Dislike" | "None"
    ): Promise<void> {
        if (status === "None") {
            await PostLikeModel.deleteOne({ userId, postId });
        } else {
            await PostLikeModel.findOneAndUpdate(
                { userId, postId },
                {
                    userId,
                    postId,
                    login,
                    status,
                    createdAt: new Date()  //обновляем время при каждом изменении
                },
                { upsert: true, new: true }
            );
        }
        const [likesCount, dislikesCount] = await Promise.all([
            PostLikeModel.countDocuments({ postId, status: "Like" }),
            PostLikeModel.countDocuments({ postId, status: "Dislike" })
        ]);

        await PostModel.updateOne(
            { _id: postId },
            { $set: { likesCount, dislikesCount } }
        );
    }

    async countLikes(postId:string):Promise<number> {
        return PostLikeModel.countDocuments({postId, status:"Like"});
    }
    async countDislikes(postId:string):Promise<number> {
        return PostLikeModel.countDocuments({postId, status:"Dislike"});
    }
}

