import {IPostRepository} from "../../repository/IPostRepository";
import {Post} from "../../entities/Post";

export class GetAllPostsService {
    constructor(private readonly postRepository: IPostRepository) {}
    async execute(): Promise<Post[]> {
        return await this.postRepository.getAllPosts();
    }
}