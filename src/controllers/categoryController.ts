import { Request, Response } from "express";
import { categoryInterface } from "../constants/interface";
import { categoryService } from "../services/categoryService";
import { Types } from "mongoose";

export class categoryControl {
    static async addCategory(req: Request, res: Response): Promise<void> {
        try {
            const category: categoryInterface = req.body

            await categoryService.newCategory(category);

            res.status(200).json({ message: "Category add successfully" });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async updateCategory(req: Request, res: Response): Promise<void> {
        try {
            const category: categoryInterface = req.body;
            const categoryId: Types.ObjectId = new Types.ObjectId(req.params.categoryId);

            await categoryService.categoryUpdation(category, categoryId);

            res.status(200).json({ message: "Category updated successfully" });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    // static async getAllProducts(req:Request, res:Response) {
    //     try {
    //         const page = Number(req.query.page);
    //         const limit = Number(req.query.limit);
    //         let query:any = {};
    //         // const searchParam = String(req.query.searchParam);
    //         if (req.query.searchParam) {
    //             query.productName = req.query.searchParam;
    //         }
    //         if(req.query.category) {
    //             query.category = req.query.category;
    //         }
    //         console.log(query);

    //         const data = await productService.getProduct(page, limit, query);

    //         res.status(200).json({ data });
    //     } catch (error: any) {
    //         res.status(400).json({ error: error.message });
    //     }
    // }

    static async deleteCategory(req:Request, res:Response): Promise<void>{
        try {
            const categoryId: string = req.params.categoryId

            await  categoryService.categoryDeletion(categoryId);

            res.status(200).json({ message: "Category deleted successfully" });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}