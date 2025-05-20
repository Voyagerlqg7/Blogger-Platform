import express from "express";
import {client} from "../mongo/ConnectDB";
import {CommentDB} from "../Objects/Comments";

export const CommentsDBCollection = client.db("BloggerPlatform").collection<CommentDB>("Comments");

export const CommentsDBController = {

};