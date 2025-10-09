import mongoose from 'mongoose';
export type BlogsDB = {
    _id: string;
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: Date;
    isMembership: boolean;
}

export const BlogSchema = new mongoose.Schema<BlogsDB>({
    _id:{ type: String, required: true },
    name:{ type: String, required: true },
    description:{ type: String, required: true },
    websiteUrl:{ type: String, required: true },
    createdAt:{ type: Date, required: true },
    isMembership:{ type: Boolean, required: true },
})