export type PostsDB = {
    id?: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName?: string
}
export let posts: PostsDB[] = [
    {
        id: "0",
        title: "post title-0",
        shortDescription: "post description-0",
        content: "post content-0",
        blogId: "post-id-0",
        blogName: "post blogName-0",
    }
]