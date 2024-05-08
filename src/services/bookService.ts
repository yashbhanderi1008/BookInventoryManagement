import { Types } from "mongoose";
import { bookInterface } from "../constants/interface";
import Book from "../models/bookModel";

export class bookService{
    static async newBook(bookDetails: bookInterface): Promise<bookInterface> {
        const book = new Book(bookDetails);

        const newBook = await book.save();

        return newBook;
    }

    static async bookUpdation(bookDetails: bookInterface, bookId: Types.ObjectId): Promise<void>{
        const book: bookInterface|null = await Book.findOneAndUpdate(bookId, bookDetails);

        if(!book){
            throw new Error("Book is not listed");
        }else{
            await book.save();
        }
    }

    static async bookDeletion(bookId: Types.ObjectId): Promise<void>{
        await Book.findOneAndDelete(bookId);
    }

    static async getBook(page: number, limit: number, query: any) {
        return await Book.find(query).skip((page - 1) * limit).limit(limit);
    }
}