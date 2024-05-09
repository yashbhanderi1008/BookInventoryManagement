import { Types } from "mongoose";
import { bookInterface } from "../constants/interface";
import Book from "../models/bookModel";
import HttpStatusConstants from "../constants/HTTPStatusConstant";
import CustomError from "../utils/customError";

export class bookService{
    static async newBook(bookDetails: bookInterface): Promise<bookInterface> {
        const book = new Book(bookDetails);

        const newBook = await book.save();

        return newBook;
    }

    static async bookUpdation(bookDetails: bookInterface, bookId: Types.ObjectId): Promise<void>{
        const book: bookInterface|null = await Book.findOneAndUpdate(bookId, bookDetails);

        if(!book){
            throw new CustomError(HttpStatusConstants.RESOURCE_NOT_FOUND.httpStatusCode, "Book is not Listed")
        }else{
            await book.save();
        }
    }

    static async bookDeletion(bookId: Types.ObjectId): Promise<void>{
        const book: bookInterface|null = await Book.findOneAndDelete(bookId);

        if(!book){
            throw new CustomError(HttpStatusConstants.RESOURCE_NOT_FOUND.httpStatusCode, "Book is not Listed")
        }
    }

    static async getBook(page: number, limit: number, query: any) {
        return await Book.find(query).skip((page - 1) * limit).limit(limit);
    }
}