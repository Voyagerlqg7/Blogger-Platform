import mongoose from "mongoose";


export const TokenSchema = new mongoose.Schema({
    _id:{type:String, required: true},
    token: {type: String, required: true},
})
