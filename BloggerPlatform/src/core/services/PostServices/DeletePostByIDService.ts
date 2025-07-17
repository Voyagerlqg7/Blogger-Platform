import {IPostRepository} from "../../repository/IPostRepository";
import {Post} from "../../entities/Post";

export class DeletePostByIDService{
    constructor(private postRepository: IPostRepository){

    }
    async execute(id:string):Promise<void|null>{

    }
}