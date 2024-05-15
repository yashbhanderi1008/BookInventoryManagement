import { NextFunction, Request, Response } from "express";
import { authorInterface, bookInterface } from "../constants/interface";
import { authorService } from "../services/authorService";
import { bookService } from "../services/bookService";
import { AuthenticatedRequest } from "../middlewares/authentication";
import { Types } from "mongoose";
import Book from "../models/bookModel";
import Category from "../models/categoryModel";

export class authorControl {
    static async signUpAuthor(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const author: authorInterface = req.body;

            await authorService.createAuthor(author);

            res.status(200).json({ message: 'Author successfully registered' });
        } catch (error: any) {
            next(error)
        }
    }

    static async loginAuthor(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const authorName: string = req.body.authorName;
            const password: string = req.body.password

            const token = await authorService.login(authorName, password);

            res.status(200).json({ data: token, message: "Successfully Log In" })
        } catch (error: any) {
            next(error)
        }
    }

    static async updateAuthor(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const author: authorInterface = req.body;

            const aId: string | undefined = (req as AuthenticatedRequest).aId

            if (aId) {
                await authorService.updateDetails(author, aId);
            }

            res.status(200).json({ message: "Author updated successfully" })
        } catch (error: any) {
            next(error)
        }
    }

    static async deleteAuthor(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const aId: string | undefined = (req as AuthenticatedRequest).aId

            if (aId) {
                await authorService.deleteDetails(aId);
            }

            res.status(200).json({ message: "Author deleted successfully" })
        } catch (error: any) {
            next(error)
        }
    }

    static async addBook(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const aId: string | undefined = (req as AuthenticatedRequest).aId;
            
            if (aId) {
                req.body.author = aId;
                const book: bookInterface = req.body;

                const newBook = await bookService.newBook(book);

                res.status(200).json({ data: newBook });
            }
        } catch (error: any) {
            next(error)
        }
    }

    static async updateBook(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const book: bookInterface = req.body
            const aId: string | undefined = (req as AuthenticatedRequest).aId
            const bookId: Types.ObjectId = new Types.ObjectId(req.params.bookId);

            if (aId) {
                const books: bookInterface[] = await Book.find({ author: aId });

                const bookIds: string[] = books.map(book => book._id.toString());

                if (bookIds.includes(bookId.toString())) {
                    await bookService.bookUpdation(book, bookId);
                    res.status(200).json({ message: "Book updated successfully" });
                } else {
                    throw new Error("You do not have access to this book.");
                }
            }
        } catch (error: any) {
            next(error)
        }
    }

    static async deleteBook(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const aId: string | undefined = (req as AuthenticatedRequest).aId
            const bookId: Types.ObjectId = new Types.ObjectId(req.params.bookId);

            if (aId) {
                const books: bookInterface[] = await Book.find({ author: aId });
                const bookIds: string[] = books.map(book => book._id.toString());

                if (bookIds.includes(bookId.toString())) {
                    await bookService.bookDeletion(bookId);
                    res.status(200).json({ message: "Book deleted successfully" });
                } else {
                    throw new Error("You do not have access to this book.");
                }
            }
        } catch (error: any) {
            next(error)
        }
    }

    static async retriveBook(req: Request, res: Response, next: NextFunction) {
        try {
            let query: any = {};
            const { searchParameter, category, page, limit } = req.query

            if (searchParameter) {
                query.bookTitle = { $regex: searchParameter, $options: 'i' };
            }
            if (category) {
                query.category = (await Category.findOne({ categoryName: category }))?._id;
            }

            query.author = new Types.ObjectId((req as AuthenticatedRequest).aId);

            const data = await bookService.getBook(Number(page), Number(limit), query);

            res.status(200).json({ data });
        } catch (error: any) {
            next(error)
        }
    }
}