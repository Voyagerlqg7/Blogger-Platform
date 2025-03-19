import {PostsDB} from "../Objects/Posts";
import {posts} from "../Objects/Posts";
import {blogs, BlogsDB} from "../Objects/Blogs";


export const PostController={
    async GetAllPosts (): Promise<PostsDB[]> {
        return posts;
    },
    async GetPostByID(id: string | null): Promise<PostsDB | undefined> {
        if (!id) return undefined;
        return posts.find(blog => blog.id === id);
    },
    async AddNewPost(post: PostsDB): Promise<PostsDB | undefined> {
        const blogExists = blogs.some(blog => blog.id === post.blogId);
        if (!blogExists) {
            console.error(`Blog with ID ${post.blogId} not found`);
            return undefined;
        }
        const newPost = {
            id: new Date().getTime().toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName ?? "",
        };
        posts.push(newPost);
        return newPost;
    },
    async DeletePostByID(id: string | null): Promise<PostsDB | undefined> {
        const post = posts.find(post => post.id === id);
        if (post) {
            posts.splice(posts.indexOf(post), 1);
            return post;
        }
        else{return undefined;}
    },
    async UpdatePostByID(id: string, post: Partial<PostsDB>): Promise<PostsDB | undefined> {
        const updatePost = posts.find(p => p.id === id);
        if (updatePost) {
            if (post.title) updatePost.title = post.title;
            if (post.shortDescription) updatePost.shortDescription = post.shortDescription;
            if (post.content) updatePost.content = post.content;
            if (post.blogName) updatePost.blogName = post.blogName;
            return updatePost;
        }
        console.error(`Post with ID ${id} not found`);
        return undefined;
    }
}