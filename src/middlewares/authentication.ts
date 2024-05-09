import jwt from "jsonwebtoken";
import Author from '../models/authorModel';
import { Request, Response, NextFunction } from 'express';
import { Types } from "mongoose";
import Admin from "../models/adminModel";
import CustomError from "../utils/customError";
import HttpStatusConstants from "../constants/HTTPStatusConstant";

export interface AuthenticatedRequest extends Request {
    aId?: string
    adminId?: string
}

export const authorizeAuthor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token = req.header('Authorization');

        if (!token) {
            return next(new CustomError(HttpStatusConstants.TOKEN_EXPIRED.httpStatusCode, HttpStatusConstants.TOKEN_EXPIRED.body.message))
        }

        token = token.replace('Bearer ', '');

        const decoded = jwt.verify(token, process.env.SECRET_KEY!) as { aId: Types.ObjectId };

        const author = await Author.findById(decoded.aId);

        if (!author) {
            return next(new CustomError(HttpStatusConstants.UNAUTHORIZED.httpStatusCode, HttpStatusConstants.UNAUTHORIZED.body.message))
        }

        (req as AuthenticatedRequest).aId = decoded.aId.toString();

        next();
    } catch (error: any) {
        return next(new CustomError(HttpStatusConstants.INTERNAL_SERVER_ERROR.httpStatusCode, HttpStatusConstants.INTERNAL_SERVER_ERROR.body.message))
    }
}

export const authorizeAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token = req.header('Authorization');

        if (!token) {
            return next(new CustomError(HttpStatusConstants.TOKEN_EXPIRED.httpStatusCode, HttpStatusConstants.TOKEN_EXPIRED.body.message))
        }

        token = token.replace('Bearer ', '');

        const decoded = jwt.verify(token, process.env.SECRET_KEY!) as { adminId: Types.ObjectId };

        const admin = await Admin.findById(decoded.adminId);

        if (!admin) {
            return next(new CustomError(HttpStatusConstants.UNAUTHORIZED.httpStatusCode, HttpStatusConstants.UNAUTHORIZED.body.message))
        }

        (req as AuthenticatedRequest).adminId = decoded.adminId.toString();

        next();
    } catch (error: any) {
        return next(new CustomError(HttpStatusConstants.INTERNAL_SERVER_ERROR.httpStatusCode, HttpStatusConstants.INTERNAL_SERVER_ERROR.body.message))
    }
}