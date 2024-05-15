import { NextFunction, Request, Response } from "express";
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

    static async signUpAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const admin: adminInterface = req.body;

            await adminService.createAdmin(admin);

            res.status(200).json({ message: 'Admin successfully registered' });
        } catch (error: any) {
            next(error)
        }
    }

    static async loginAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userName: string = req.body.userName;
            const password: string = req.body.password

            const token = await adminService.login(userName, password);

            res.status(200).json({ data: token, message: "Successfully Log In" })
        } catch (error: any) {
            next(error)
        }
    }

    static async addBook(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const book: bookInterface = req.body

            const newBook = await bookService.newBook(book);

            res.status(200).json({ data: newBook });
        } catch (error: any) {
            next(error);
        }
    }

    static async updateBook(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const book: bookInterface = req.body
            const bookId: Types.ObjectId = new Types.ObjectId(req.params.bookId);

            await bookService.bookUpdation(book, bookId);

            res.status(200).json({ message: "Book updated successfully" });
        } catch (error: any) {
            next(error);
        }
    }

    static async deleteBook(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const bookId: Types.ObjectId = new Types.ObjectId(req.params.bookId);

            await bookService.bookDeletion(bookId);

            res.status(200).json({ message: "Book deleted successfully" });
        } catch (error: any) {
            next(error);
        }
    }

    static async retriveAuthor(req: Request, res: Response, next: NextFunction) {
        try {
            let query: any = {};
            const { searchParameter, nationality, page, limit } = req.query

            if (searchParameter) {
                query.authorName = searchParameter;
            }
            if (nationality) {
                query.nationality = nationality;
            }

            const data = await authorService.getAuthor(Number(page), Number(limit), query);

            res.status(200).json({ data });
        } catch (error: any) {
            next(error);
        }
    }

    static async retriveCategory(req: Request, res: Response, next: NextFunction) {
        try {
            let query: any = {};
            const { searchParameter, page, limit } = req.query

            if (searchParameter) {
                query.categoryName = searchParameter;
            }

            const data = await categoryService.getCategory(Number(page), Number(limit), query);

            res.status(200).json({ data });
        } catch (error: any) {
            next(error);
        }
    }

    static async retriveBook(req: Request, res: Response, next: NextFunction) {
        try {
            let query: any = {};
            const { searchParameter, author, category, page, limit } = req.query

            if (searchParameter) {
                query.bookTitle = { $regex: searchParameter, $options: 'i' };
            }
            if (author) {
                query.author = (await Author.findOne({ authorName: author }))?._id;
            }
            if (category) {
                query.category = (await Category.findOne({ categoryName: category }))?._id;
            }

            const data = await bookService.getBook(Number(page), Number(limit), query);

            res.status(200).json({ data });
        } catch (error: any) {
            next(error);
        }
    }
}