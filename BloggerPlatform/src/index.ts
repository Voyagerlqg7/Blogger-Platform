import express from 'express';
import {BlogsRouter} from "./routes/BlogsRouter";
const app = express();
const port = process.env.PORT || 6419;

app.use(express.json());

app.use("/blogs", BlogsRouter);
app.use("/blogs/:id", BlogsRouter);


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})
export default app;