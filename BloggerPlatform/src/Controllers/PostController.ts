import {PostsDB} from "../DataB/Posts";
import {posts} from "../DataB/Posts";

export const PostController={
    GetAllPosts (): PostsDB[] {
        return posts;
    },
    GetPostByID(id: string | null): PostsDB | undefined {
        if (!id) return undefined;
        return posts.find(blog => blog.id === id);
    },
    AddNewPost (post: PostsDB):void {
        let newPost ={
            id: new Date().getTime().toString(),
            title : post.title,
            shortDescription : post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName ?? "",
        }
        posts.push(newPost);
    },
    DeletePostByID(id: string | null): PostsDB | undefined {
        const post = posts.find(post => post.id === id);
        if (post) {
            posts.splice(posts.indexOf(post), 1);
            return post;
        }
        else{return undefined;}
    }

}