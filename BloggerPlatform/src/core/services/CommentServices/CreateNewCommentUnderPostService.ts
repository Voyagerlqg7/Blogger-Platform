import { Comment } from "../../entities/Comment";
import { ICommentsRepository } from "../../repository/ICommentsRepository";
import { v4 as uuidv4 } from 'uuid';
import {IPostRepository} from "../../repository/IPostRepository";

export class CreateNewCommentUnderPostService {
    constructor(private readonly commentRepository: ICommentsRepository,
                private readonly postRepository: IPostRepository) {}

    async execute(
        postId: string,
        content:string,
    ): Promise<Comment | null> {
        const post = await this.postRepository.getPostById(postId);
        if (!post) throw new Error("Could not find post with id " + postId);

        const id = uuidv4();
        const newComment = {
            id,
            content,
            commentatorInfo:{
                
            },
            createdAt: new Date().toISOString()
        }
        return await this.commentRepository.createCommentByPostID(postId, newComment);
    }

}
