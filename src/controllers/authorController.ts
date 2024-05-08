import { Request, Response } from "express";
import { authorInterface, bookInterface } from "../constants/interface";
import { authorService } from "../services/authorService";
import { bookService } from "../services/bookService";
import { AuthenticatedRequest } from "../middlewares/authentication";
import { Types } from "mongoose";
import Book from "../models/bookModel";
import Category from "../models/categoryModel";

export class authorControl {
    static async signUpAuthor(req: Request, res: Response): Promise<void> {
        try {
            const author: authorInterface = req.body;

            await authorService.createAuthor(author);

            res.status(200).json({ message: 'Author successfully registered' });
        } catch (error: any) {
            res.status(400).json({ error: error.message })
        }
    }

    static async loginAuthor(req: Request, res: Response): Promise<void> {
        try {
            const authorName: string = req.body.authorName;
            const password: string = req.body.password

            const token = await authorService.login(authorName, password);

            res.status(200).json({ data: token, message: "Successfully Log In" })
        } catch (error: any) {
            res.status(400).json({ error: error.message })
        }
    }

    static async updateAuthor(req: Request, res: Response): Promise<void> {
        try {
            const author: authorInterface = req.body;

            const aId: string | undefined = (req as AuthenticatedRequest).aId

            if (aId !== undefined) {
                await authorService.updateDetails(author, aId);
            }

            res.status(200).json({ message: "Author updated successfully" })
        } catch (error: any) {
            res.status(400).json({ error: error.message })
        }
    }

    static async deleteAuthor(req: Request, res: Response): Promise<void> {
        try {
            const aId: string | undefined = (req as AuthenticatedRequest).aId

            if (aId !== undefined) {
                await authorService.deleteDetails(aId);
            }

            res.status(200).json({ message: "Author deleted successfully" })
        } catch (error: any) {
            res.status(400).json({ error: error.message })
        }
    }

    static async addBook(req: Request, res: Response): Promise<void> {
        try {
            const aId: string | undefined = (req as AuthenticatedRequest).aId
            req.body.author = aId;
            const book: bookInterface = req.body;

            const newBook = await bookService.newBook(book);

            res.status(200).json({ data: newBook });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async updateBook(req: Request, res: Response): Promise<void> {
        try {
            const book: bookInterface = req.body
            const aId: string | undefined = (req as AuthenticatedRequest).aId
            const bookId: Types.ObjectId = new Types.ObjectId(req.params.bookId);

            if (aId !== undefined) {
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
            res.status(400).json({ error: error.message });
        }
    }

    static async deleteBook(req: Request, res: Response): Promise<void> {
        try {
            const aId: string | undefined = (req as AuthenticatedRequest).aId
            const bookId: Types.ObjectId = new Types.ObjectId(req.params.bookId);

            if (aId !== undefined) {
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
            res.status(400).json({ error: error.message });
        }
    }

    static async retriveBook(req: Request, res: Response) {
        try {
            const page = Number(req.query.page);
            const limit = Number(req.query.limit);
            let query: any = {};

            if (req.query.searchParameter) {
                query.bookTitle = req.query.searchParameter;
            }
            if (req.query.category) {
                query.category = (await Category.findOne({ categoryName: req.query.category }))?._id;
            }
            query.author = (req as AuthenticatedRequest).aId;
            
            const data = await bookService.getBook(page, limit, query);

            res.status(200).json({ data });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}