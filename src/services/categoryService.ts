import Category from "../models/categoryModel";
import { categoryInterface } from "../constants/interface";
import { Types } from "mongoose";

export class categoryService {
    static async newCategory(categoryDetails: categoryInterface): Promise<void> {
        const category = new Category(categoryDetails);

        await category.save();

        return;
    }

    static async categoryUpdation(categoryDetails: categoryInterface, categoryId: Types.ObjectId): Promise<void> {
        const category: categoryInterface | null = await Category.findOneAndUpdate(categoryId, categoryDetails);

        if (!category) {
            throw new Error("Category is not listed");
        } else {
            await category.save();
        }
    }

    static async categoryDeletion(categoryId: string): Promise<void> {
        await Category.findByIdAndDelete(categoryId)
    }

    static async getCategory(page: number, limit: number, query: any) {
        return await Category.find(query).skip((page - 1) * limit).limit(limit);
    }
}