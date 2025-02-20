import {PostsDB} from "../DataB/Posts";
import {posts} from "../DataB/Posts";
import {blogs, BlogsDB} from "../DataB/Blogs";


export const PostController={
    GetAllPosts (): PostsDB[] {
        return posts;
    },
    GetPostByID(id: string | null): PostsDB | undefined {
        if (!id) return undefined;
        return posts.find(blog => blog.id === id);
    },
    AddNewPost (post: PostsDB): PostsDB| undefined {
        let newPost ={
            id: new Date().getTime().toString(),
            title : post.title,
            shortDescription : post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName ?? "",
        }
        posts.push(newPost);
        return newPost;
    },
    DeletePostByID(id: string | null): PostsDB | undefined {
        const post = posts.find(post => post.id === id);
        if (post) {
            posts.splice(posts.indexOf(post), 1);
            return post;
        }
        else{return undefined;}
    },
    UpdatePostByID(id: string, post: PostsDB): PostsDB | undefined {
        const updatePost = posts.find(post => post.id === id);
        if (updatePost) {
            updatePost.title = post.title;
            updatePost.shortDescription = post.shortDescription;
            updatePost.content = post.content;
            updatePost.blogName = post.blogName;
            return updatePost;
        }
        else{return undefined;}
    }
}