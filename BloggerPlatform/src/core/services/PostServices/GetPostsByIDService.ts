import {IPostRepository} from "../../repository/IPostRepository";
import {Post} from "../../entities/Post";

export class GetPostsByPostIDService{
    constructor(private readonly postRepository: IPostRepository) {
    }
    async execute(postId:string):Promise<Post | null> {
        return await this.postRepository.getPostById(postId);
    }
}