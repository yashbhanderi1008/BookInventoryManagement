import mongoose, { Schema } from "mongoose";
import { adminInterface } from "../constants/interface";

const adminSchema = new mongoose.Schema<adminInterface>({
    userName: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    }
},
{
    timestamps: true
});

const Admin = mongoose.model<adminInterface>('Admin', adminSchema);

export default Admin;