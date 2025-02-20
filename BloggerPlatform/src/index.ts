import express, {Request, Response} from 'express';
import {BlogsRouter} from "./routes/BlogsRoutes";
import {PostRouter} from "./routes/PostsRoutes";
import {blogs} from "./DataB/Blogs";
import {posts} from "./DataB/Posts";


const app = express();
const port = process.env.PORT || 6419;

app.use(express.json());

app.delete('/testing/all-data', (request: Request, response: Response) => {
    blogs.length = 0;
    posts.length = 0;
    response.status(204).send();
});

app.use("/blogs", BlogsRouter);
app.use("/posts", PostRouter)


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})
export default app;