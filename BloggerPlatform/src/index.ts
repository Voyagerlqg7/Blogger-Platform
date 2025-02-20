import express from 'express';
import {BlogsRouter} from "./routes/BlogsRoutes";
import {PostRouter} from "./routes/PostsRoutes";
const app = express();
const port = process.env.PORT || 6419;

app.use(express.json());

app.use("/blogs", BlogsRouter);
app.use("/posts", PostRouter)

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})
export default app;