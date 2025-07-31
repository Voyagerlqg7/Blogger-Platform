import {Blog} from "../../../core/entities/Blog";
import {BlogsDB} from "../models/BlogModel";
import {ObjectId} from "mongodb"

export class BlogMapper {
    static toDomain(blogDB: BlogsDB): Blog {
        return new Blog(
            blogDB._id.toString(),
            blogDB.name,
            blogDB.description,
            blogDB.websiteUrl,
            blogDB.createdAt.toISOString(),
            blogDB.isMembership
        );
    }

    static toPersistence(blog: Blog): BlogsDB {
        return {
            _id: new ObjectId(blog.id),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: new Date(blog.createdAt),
            isMembership: blog.isMembership
        };
    }
}