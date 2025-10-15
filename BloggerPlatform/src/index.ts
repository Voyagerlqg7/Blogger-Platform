import express, {Request, Response} from 'express';
import "reflect-metadata";
import {authRouter} from "./infrastructure/controllers/routes/authRoutes"
import {blogRouter} from "./infrastructure/controllers/routes/blogRoutes";
import {commentRouter} from "./infrastructure/controllers/routes/commentRoutes";
import {userRouter} from "./infrastructure/controllers/routes/userRoutes";
import {postRouter} from "./infrastructure/controllers/routes/postRoutes";
import {securityDevicesRouter} from "./infrastructure/controllers/routes/securityRoute";
import {connectDB} from "./infrastructure/db/connection";
import {client} from "./infrastructure/db/connection";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';


dotenv.config();
const app = express();
const port = process.env.PORT || 6419;
app.set('trust proxy', true)
app.use(express.json());
app.use(cookieParser())

app.use("/blogs", blogRouter);
app.use("/posts", postRouter);
app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/comments", commentRouter);
app.use("/security/devices", securityDevicesRouter)

const startApp = async () => {
    await connectDB();

    app.delete('/testing/all-data', async (request: Request, response: Response) => {
        try {
            const db = client.db("BloggerPlatform");
            await db.collection("blogs").deleteMany({});
            await db.collection("posts").deleteMany({});
            await db.collection("users").deleteMany({});
            await db.collection("comments").deleteMany({});
            await db.collection("token").deleteMany({});
            await db.collection("commentLikes").deleteMany({});
            await db.collection("customRateLimit").deleteMany({});
            await db.collection("sessions").deleteMany({});
            //await db.collection("customRateLimit").createIndex({ date: 1 }, { expireAfterSeconds: 60 });//чтобы данные удалялись через минуту, не хранить мусор
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