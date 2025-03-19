import express, {Request, Response} from 'express';
import {BlogsRouter} from "./routes/BlogsRoutes";
import {PostRouter} from "./routes/PostsRoutes";
import {blogs} from "./Objects/Blogs";
import {posts} from "./Objects/Posts";



const app = express();
const port = process.env.PORT || 6419;
app.use(express.json());

try{

    app.delete('/testing/all-data', (request: Request, response: Response) => {
        blogs.length = 0;
        posts.length = 0;
        response.status(204).send();
    });
    app.use("/blogs", BlogsRouter);
    app.use("/posts", PostRouter)
}
catch(err){
    console.log(err);
}

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})
export default app;