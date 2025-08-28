import {IBlogRepository} from "../../../core/repository/IBlogRepository";
import {Blog} from "../../../core/entities/Blog";
import {blogsDBCollection, postsDBCollection} from "../collections/collections"
import {ObjectId} from "mongodb"
import {BlogMapper} from "../mappers/BlogMapper";
import {UpdateBlogDTO} from "../../../core/repository/DTO/BlogDTO";
import {PostMapper} from "../mappers/PostMapper";
import {Post} from "../../../core/entities/Post";
import {BlogsQueryDTO, PagedResponse, PostsQueryDTO} from "../../../core/repository/DTO/QueryParamsDTO";

export class BlogRepository implements IBlogRepository {
    async getAllBlogs(query: BlogsQueryDTO): Promise<PagedResponse<Blog>> {
        const filter: any = {};

        if (query.searchNameTerm) {
            filter.name = { $regex: query.searchNameTerm, $options: 'i' };
        }

        const totalCount = await blogsDBCollection.countDocuments(filter);

        const items = await blogsDBCollection
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
            items: items.map(BlogMapper.toDomain)
        };
    }

    async createBlog(blog:Blog): Promise<Blog> {
        const newBlog = BlogMapper.toPersistence(blog);
        await blogsDBCollection.insertOne(newBlog);
        return BlogMapper.toDomain(newBlog);
    }
    async getBlogById(blogId:string):Promise<Blog | null> {
        const blog = await blogsDBCollection.findOne({_id: new ObjectId(blogId)});
        if (!blog) {
            return null;
        }
        return BlogMapper.toDomain(blog);
    }
    async updateBlogById(blogId: string, dto: UpdateBlogDTO): Promise<void> {
        await blogsDBCollection.updateOne(
            { _id: new ObjectId(blogId) },
            { $set: { name: dto.name, description: dto.description, websiteUrl: dto.websiteUrl } }
        );
    }
    async getAllPostsFromBlog(blogId: string, query:PostsQueryDTO): Promise<PagedResponse<Post>|null> {
        const blog = await blogsDBCollection.findOne({_id: new ObjectId(blogId)});
        if (!blog) {
            return null;
        }
        else{
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
    }

    async createNewPostForSpecialBlog(post:Post):Promise<Post>{
        const newPost = PostMapper.toPersistence(post);
        await postsDBCollection.insertOne(newPost);
        return PostMapper.toDomain(newPost);
    }
    async deleteBlogById(blogId: string): Promise<void> {
        await blogsDBCollection.deleteOne({ _id: new ObjectId(blogId) });
    }

}