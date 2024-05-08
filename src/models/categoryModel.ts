import mongoose from "mongoose";
import { categoryInterface } from "../constants/interface";

const categorySchema = new mongoose.Schema<categoryInterface>({
    categoryName:{
        type: String,
        required: true,
        unique: true
    },
    description:{
        type: String,
        required: true
    }
},
{
    timestamps: true
})

const Category = mongoose.model<categoryInterface>('Category', categorySchema);

export default Category;