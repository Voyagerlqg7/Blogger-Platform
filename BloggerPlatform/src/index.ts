import express, {Request, Response} from 'express';
import {BlogsRouter} from "./routes/BlogsRoutes";
import {PostRouter} from "./routes/PostsRoutes";
import {UserRouter} from "./routes/UserRouter";
import {AuthRouter} from "./routes/authRouter"
import {connectDB}from "./mongo/ConnectDB";
import {client} from "./mongo/ConnectDB";

const app = express();
const port = process.env.PORT || 6419;
app.use(express.json());

app.use("/blogs", BlogsRouter);
app.use("/posts", PostRouter);
app.use("/users", UserRouter);
app.use("/auth", AuthRouter);

const startApp = async () => {
    await connectDB();

    app.delete('/testing/all-data', async (request: Request, response: Response) => {
        try {
            const db = client.db("BloggerPlatform");
            await db.collection("blogs").deleteMany({});
            await db.collection("posts").deleteMany({});
            response.status(204).send();
        } catch (error) {
            console.error("Error deleting data:", error);
            response.status(500).json({ error: "Error deleting data" });
        }
    });

    app.listen(port, () => {
        console.log(`Listening on port ${port}`);
    });
};

startApp();
export default app;