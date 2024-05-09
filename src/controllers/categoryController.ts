import { NextFunction, Request, Response } from "express";
import { categoryInterface } from "../constants/interface";
import { categoryService } from "../services/categoryService";
import { Types } from "mongoose";

export class categoryControl {
    static async addCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const category: categoryInterface = req.body

            await categoryService.newCategory(category);

            res.status(200).json({ message: "Category add successfully" });
        } catch (error: any) {
            next(error)
        }
    }

    static async updateCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const category: categoryInterface = req.body;
            const categoryId: Types.ObjectId = new Types.ObjectId(req.params.categoryId);

            await categoryService.categoryUpdation(category, categoryId);

            res.status(200).json({ message: "Category updated successfully" });
        } catch (error: any) {
            next(error)
        }
    }

    static async deleteCategory(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const categoryId: string = req.params.categoryId

            await  categoryService.categoryDeletion(categoryId);

            res.status(200).json({ message: "Category deleted successfully" });
        } catch (error: any) {
            next(error)
        }
    }
}