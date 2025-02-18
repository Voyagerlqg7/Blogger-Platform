import express from "express"
import {Request, Response} from "express"
const app = express();
const port = process.env.PORT || 6419;

app.use(express.json());




export default app;