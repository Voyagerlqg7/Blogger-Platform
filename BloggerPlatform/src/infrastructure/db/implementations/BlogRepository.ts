import {IBlogRepository} from "../../../core/repository/IBlogRepository";
import {Blog} from "../../../core/entities/Blog";
import {BlogModel, PostLikeModel, PostModel} from "../Models/collections";
import {BlogMapper} from "../mappers/BlogMapper";
import {UpdateBlogDTO} from "../../../core/repository/DTO/BlogDTO";
import {PostMapper} from "../mappers/PostMapper";
import {Post} from "../../../core/entities/Post";
import {BlogsQueryDTO, PagedResponse, PostsQueryDTO} from "../../../core/repository/DTO/QueryParamsDTO";
import { injectable } from "inversify";


@injectable()
export class BlogRepository implements IBlogRepository{
    async getAllBlogs(query: BlogsQueryDTO): Promise<PagedResponse<Blog>> {
        const filter: any = {};

        if (query.searchNameTerm) {
            filter.name = { $regex: query.searchNameTerm, $options: 'i' };
        }

        const totalCount = await BlogModel.countDocuments(filter);

        const items = await BlogModel
            .find(filter)
            .sort({ [query.sortBy]: query.sortDirection === "asc" ? 1 : -1 })
            .skip((query.pageNumber - 1) * query.pageSize)
            .limit(query.pageSize).lean();

        return {
            pagesCount: Math.ceil(totalCount / query.pageSize),
            page: query.pageNumber,
            pageSize: query.pageSize,
            totalCount,
            items: items.map(BlogMapper.toDomain)
        };
    }

    async createBlog(blog:Blog): Promise<Blog> {
        const newBlog = BlogMapper.toPersistence(blog);
        await BlogModel.insertOne(newBlog);
        return BlogMapper.toDomain(newBlog);
    }
    async getBlogById(blogId:string):Promise<Blog | null> {
        const blog = await BlogModel.findOne({_id: blogId});
        if (!blog) {
            return null;
        }
        return BlogMapper.toDomain(blog);
    }
    async updateBlogById(blogId: string, dto: UpdateBlogDTO): Promise<void> {
        await BlogModel.updateOne(
            { _id: blogId },
            { $set: { name: dto.name, description: dto.description, websiteUrl: dto.websiteUrl } }
        );
    }
    async getAllPostsFromBlog(blogId: string, query: PostsQueryDTO, userId?: string): Promise<PagedResponse<Post>> {
        const filter = { blogId };
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
                    likes: { $slice: ["$likes", 3] }
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
    async createNewPostForSpecialBlog(post: Post): Promise<Post> {
        const newPost = PostMapper.toPersistence(post);
        await PostModel.insertOne(newPost);
        return PostMapper.toDomain(newPost, "None", []);
    }

    async deleteBlogById(blogId: string): Promise<void> {
        await BlogModel.deleteOne({ _id: blogId });
    }

}