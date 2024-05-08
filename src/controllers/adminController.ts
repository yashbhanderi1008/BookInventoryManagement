import { Request, Response } from "express";
import { adminService } from "../services/adminService";
import { adminInterface } from "../constants/interface";
import { bookInterface } from "../constants/interface";
import { bookService } from "../services/bookService";
import { Types } from "mongoose";
import { authorService } from "../services/authorService";
import { categoryService } from "../services/categoryService";
import Author from "../models/authorModel";
import Category from "../models/categoryModel";

export class adminControl {

    static async signUpAdmin(req: Request, res: Response): Promise<void> {
        try {
            const admin: adminInterface = req.body;

            await adminService.createAdmin(admin);

            res.status(200).json({ message: 'Admin successfully registered' });
        } catch (error: any) {
            res.status(400).json({ error: error.message })
        }
    }

    static async loginAdmin(req: Request, res: Response): Promise<void> {
        try {
            const userName: string = req.body.userName;
            const password: string = req.body.password

            const token = await adminService.login(userName, password);

            res.status(200).json({ data: token, message: "Successfully Log In" })
        } catch (error: any) {
            res.status(400).json({ error: error.message })
        }
    }

    static async addBook(req: Request, res: Response): Promise<void> {
        try {
            const book: bookInterface = req.body

            const newBook = await bookService.newBook(book);

            res.status(200).json({ data: newBook });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async updateBook(req: Request, res: Response): Promise<void> {
        try {
            const book: bookInterface = req.body
            const bookId: Types.ObjectId = new Types.ObjectId(req.params.bookId);

            await bookService.bookUpdation(book, bookId);

            res.status(200).json({ message: "Book updated successfully" });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async deleteBook(req: Request, res: Response): Promise<void> {
        try {
            const bookId: Types.ObjectId = new Types.ObjectId(req.params.bookId);

            await bookService.bookDeletion(bookId);

            res.status(200).json({ message: "Book deleted successfully" });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async retriveAuthor(req: Request, res: Response) {
        try {
            const page = Number(req.query.page);
            const limit = Number(req.query.limit);
            let query: any = {};

            if (req.query.searchParameter) {
                query.authorName = req.query.searchParameter;
            }
            if (req.query.nationality) {
                query.nationality = req.query.nationality;
            }

            const data = await authorService.getAuthor(page, limit, query);

            res.status(200).json({ data });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async retriveCategory(req: Request, res: Response) {
        try {
            const page = Number(req.query.page);
            const limit = Number(req.query.limit);
            let query: any = {};

            if (req.query.searchParameter) {
                query.categoryName = req.query.searchParameter;
            }

            const data = await categoryService.getCategory(page, limit, query);

            res.status(200).json({ data });
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
            if (req.query.author) {
                query.author = (await Author.findOne({ authorName: req.query.author }))?._id;
            }
            if (req.query.category) {
                query.category = (await Category.findOne({ categoryName: req.query.category }))?._id;
            }

            const data = await bookService.getBook(page, limit, query);

            res.status(200).json({ data });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}