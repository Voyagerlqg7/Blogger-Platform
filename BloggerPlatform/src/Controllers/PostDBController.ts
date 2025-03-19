import { PostsDB } from "../Objects/Posts";
import { BlogsDB } from "../Objects/Blogs";
import { client } from "../mongo/ConnectDB";

const postsCollection = client.db("Posts").collection<PostsDB>("posts");
const blogsCollection = client.db("Blogs").collection<BlogsDB>("blogs");

export const PostDBController = {
    async GetAllPosts(): Promise<PostsDB[]> {
        return await postsCollection.find().toArray();
    },
    async GetPostByID(id: string): Promise<PostsDB | undefined> {
        if (!id) return undefined;
        return await postsCollection.findOne({ id: id }) || undefined;
    },
    async AddNewPost(post: Omit<PostsDB, "id">): Promise<PostsDB | undefined> {
        const IfBlogExist = await blogsCollection.findOne({ id: post.blogId });
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
