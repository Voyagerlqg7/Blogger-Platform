import mongoose from "mongoose";

export const RequestLogSchema = new mongoose.Schema({
    _id:{type:String, required: true},
    ip:{type:String, required: true},
    url:{type:String, required: true},
    date: { type: Date, default: Date.now, expires: 60 }
})