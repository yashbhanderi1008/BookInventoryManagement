import Admin from '../models/adminModel';
import { adminInterface } from '../constants/interface';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import HttpStatusConstants from '../constants/HTTPStatusConstant';
import CustomError from '../utils/customError';

export class adminService{

    static async createAdmin(adminDetails: adminInterface): Promise<void> {
        if (await Admin.findOne({ userName: adminDetails.userName })) {
            throw new CustomError(HttpStatusConstants.DUPLICATE_KEY_VALUE.httpStatusCode, "Admin already exists")
        }

        adminDetails.password = await bcrypt.hash(adminDetails.password, 10);

        const newAdmin = new Admin(adminDetails);

        await newAdmin.save();
    }

    static async login(userName: string, password: string): Promise<string>{
        const admin = await Admin.findOne({ userName: userName });

        if (!admin) {
            throw new CustomError(HttpStatusConstants.RESOURCE_NOT_FOUND.httpStatusCode, "Admin doesn't exists")
        }

        const isPassword = await bcrypt.compare(password, admin.password);

        if (isPassword) {
            const token = jwt.sign({ adminId: admin._id!.toString() }, process.env.SECRET_KEY!, { algorithm: 'HS256' });

            return token;
        } else {
            throw new CustomError(HttpStatusConstants.INVALID_DATA.httpStatusCode, "Wrong credemtials")
        }
    }
}