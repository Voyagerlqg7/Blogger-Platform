export type BlogsDB = {
    id?: string;
    name: string;
    description: string;
    websiteUrl: string;
}

export let blogs: BlogsDB[] = [
    {
        id : "0",
        name : "name testBlog-0",
        description : "description testBlog-0",
        websiteUrl: "websiteUrl testBlog-0",
    }
]