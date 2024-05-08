import jwt from "jsonwebtoken";
import Author from '../models/authorModel';
import { Request, Response, NextFunction } from 'express';
import { Types } from "mongoose";
import Admin from "../models/adminModel";

export interface AuthenticatedRequest extends Request {
    aId?: string
    adminId?: string
}

export const authorizeAuthor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token = req.header('Authorization');

        if (!token) {
            return res.status(401).send({ message: 'Token is not set in Request Header' });
        }

        token = token.replace('Bearer ', '');

        const decoded = jwt.verify(token, 'YashBhanderi') as { aId: Types.ObjectId };

        const author = await Author.findById(decoded.aId);

        if (!author) {
            return res.status(401).send({ message: 'Authorization Error' });
        }

        (req as AuthenticatedRequest).aId = decoded.aId.toString();

        next();
    } catch (error: any) {
        res.status(500).send({ message: error.message || 'Internal Server Error' });
    }
}

export const authorizeAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token = req.header('Authorization');

        if (!token) {
            return res.status(401).send({ message: 'Token is not set in Request Header' });
        }

        token = token.replace('Bearer ', '');

        const decoded = jwt.verify(token, 'YashBhanderi') as { adminId: Types.ObjectId };

        const admin = await Admin.findById(decoded.adminId);

        if (!admin) {
            return res.status(401).send({ message: 'Authorization Error' });
        }

        (req as AuthenticatedRequest).adminId = decoded.adminId.toString();

        next();
    } catch (error: any) {
        res.status(500).send({ message: error.message || 'Internal Server Error' });
    }
}