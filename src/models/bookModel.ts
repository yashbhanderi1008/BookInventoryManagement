import mongoose from "mongoose";
import { bookInterface } from "../constants/interface";

const bookSchema = new mongoose.Schema<bookInterface>({
    bookTitle: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    ISBN: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
},
{
    timestamps: true
})

const Book = mongoose.model<bookInterface>('Book', bookSchema);

export default Book;