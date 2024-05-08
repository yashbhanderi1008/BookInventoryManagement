import mongoose from "mongoose";
import { authorInterface } from "../constants/interface";

const authorSchema = new mongoose.Schema<authorInterface>({
    authorName: {
        type: String,
        required: true,
        unique: true
    },
    biography: {
        type: String,
        required: true
    },
    nationality: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
},
{
    timestamps: true
});

const Author = mongoose.model<authorInterface>('Author', authorSchema);

export default Author;