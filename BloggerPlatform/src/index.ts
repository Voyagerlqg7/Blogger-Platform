import express, {Request, Response} from 'express';
import {BlogsRouter} from "./routes/BlogsRoutes";
import {PostRouter} from "./routes/PostsRoutes";
import {connectDB}from "./mongo/ConnectDB";
import {client} from "./mongo/ConnectDB";

const app = express();
const port = process.env.PORT || 6419;
app.use(express.json());

app.use("/blogs", BlogsRouter);
app.use("/posts", PostRouter)

const startApp = async () => {
    await connectDB();

    app.delete('/testing/all-data', async (request: Request, response: Response) => {
        await client.db("BloggerPlatform").collection("blogs").deleteMany({});
        await client.db("BloggerPlatform").collection("posts").deleteMany({});
        response.status(204).send();
    });

    app.listen(port, () => {
        console.log(`Listening on port ${port}`);
    });
};

startApp();
export default app;