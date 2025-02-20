import express from 'express';
import {BlogsRouter} from "./routes/BlogsRoutes";
import {PostRouter} from "./routes/PostsRoutes";
import {Request, Response} from "express";
import {blogs} from "../src/DataB/Blogs"
import {posts} from "../src/DataB/Posts"

const app = express();
const port = process.env.PORT || 6419;

app.use(express.json());

app.use("/blogs", BlogsRouter);
app.use("/posts", PostRouter)

app.get('/testing/all-data',  (request: Request, response: Response) => {
    blogs.length = 0;
    posts.length = 0;
});



app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})
export default app;