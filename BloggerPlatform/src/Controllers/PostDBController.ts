import { PostsDB } from "../Objects/Posts";
import { BlogsDB } from "../Objects/Blogs";
import { client } from "../mongo/ConnectDB";
import { ObjectId } from "mongodb";

const postsCollection = client.db("BloggerPlatform").collection<PostsDB>("posts");
const blogsCollection = client.db("BloggerPlatform").collection<BlogsDB>("blogs");

export const PostDBController = {
    async GetAllPosts(): Promise<PostsDB[]> {
        const posts = await postsCollection.find().toArray();

        return posts.map(posts => ({
            id: posts._id.toString(),
            title: posts.title,
            shortDescription: posts.shortDescription,
            content: posts.content,
            blogId: posts.blogId,
            blogName: posts.blogName,
            createdAt: posts.createdAt,
        }));
    },
    async GetPostByID(id: string): Promise<PostsDB | undefined> {
        if (!id) return undefined;
        return await postsCollection.findOne({ id: id }) || undefined;
    },
    async AddNewPost(post: Omit<PostsDB, "id">): Promise<PostsDB | undefined> {
        const IfBlogExist = await blogsCollection.findOne({ _id: new ObjectId(post.blogId) });

        if (!IfBlogExist) {
            console.error(`Blog with ID ${post.blogId} not found`);
            return undefined;
        }

        const newPost: PostsDB = {
            id: new Date().getTime().toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            createdAt: new Date().toISOString(),
            blogName: IfBlogExist.name,
        };

        const result = await postsCollection.insertOne(newPost);
        return result.acknowledged ? newPost : undefined;
    },
    async DeletePostByID(id: string | null): Promise<boolean> {
        if (!id) return false;
        const result = await postsCollection.deleteOne({ id: id });
        return result.deletedCount > 0;
    },
    async UpdatePostByID(id: string, post: Partial<PostsDB>): Promise<PostsDB | undefined> {
        if (!id) return undefined;
        const updateResult = await postsCollection.findOneAndUpdate(
            { id: id },
            { $set: post },
            { returnDocument: "after" }
        );
        return updateResult || undefined;
    }
};
