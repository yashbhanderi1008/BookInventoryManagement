import {Request,Response, NextFunction } from "express";
import CustomError from "../utils/customError";
 
 
class ErrorHandler{
    public static async  errorHandlerMiddlerWare(err:CustomError,req:Request,res:Response,next:NextFunction):Promise<void>{
        res.status(err.status).json({
            message:err.message
        })
    }
}
 
export default ErrorHandler