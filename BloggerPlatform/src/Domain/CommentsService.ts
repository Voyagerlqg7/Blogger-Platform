import express from "express";
import {CommentDB} from "../Objects/Comments";

export const CommentsService = {
    async GetCommentById(commentIf:string):Promise<CommentDB| undefined>{

    },
    async UpdateCommentById(commentsId:string):Promise<CommentDB| undefined>{

    },
    async DeleteCommentById(commentsId:string){

    }
};