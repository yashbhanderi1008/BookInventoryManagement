import Category from "../models/categoryModel";
import { categoryInterface } from "../constants/interface";
import { Types } from "mongoose";
import CustomError from "../utils/customError";
import HttpStatusConstants from "../constants/HTTPStatusConstant";

export class categoryService {
    static async newCategory(categoryDetails: categoryInterface): Promise<void> {
        const category = new Category(categoryDetails);

        await category.save();

        return;
    }

    static async categoryUpdation(categoryDetails: categoryInterface, categoryId: Types.ObjectId): Promise<void> {
        const category: categoryInterface | null = await Category.findOneAndUpdate(categoryId, categoryDetails);

        if (!category) {
            throw new CustomError(HttpStatusConstants.RESOURCE_NOT_FOUND.httpStatusCode, "Category is not Listed")
        } else {
            await category.save();
        }
    }

    static async categoryDeletion(categoryId: string): Promise<void> {
        const category: categoryInterface | null = await Category.findByIdAndDelete(categoryId)

        if (!category) {
            throw new CustomError(HttpStatusConstants.RESOURCE_NOT_FOUND.httpStatusCode, "Category is not Listed")
        }
    }

    static async getCategory(page: number, limit: number, query: any) {
        return await Category.find(query).skip((page - 1) * limit).limit(limit);
    }
}