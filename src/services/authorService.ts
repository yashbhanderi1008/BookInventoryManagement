import CustomError from "../utils/customError";
import HttpStatusConstants from "../constants/HTTPStatusConstant";
import { authorInterface } from "../constants/interface";
import Author from "../models/authorModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class authorService {
    static async createAuthor(authorDetails: authorInterface): Promise<void> {
        if (await Author.findOne({ authorName: authorDetails.authorName })) {
            throw new CustomError(HttpStatusConstants.DUPLICATE_KEY_VALUE.httpStatusCode, "Author already exists")
        }

        authorDetails.password = await bcrypt.hash(authorDetails.password, 10);

        const newAuthor = new Author(authorDetails);

        await newAuthor.save();
    }

    static async login(authorName: string, password: string): Promise<string> {
        const author = await Author.findOne({ authorName: authorName });

        if (!author) {
            throw new CustomError(HttpStatusConstants.RESOURCE_NOT_FOUND.httpStatusCode, "Author doesn't exists")
        }

        const isPassword = await bcrypt.compare(password, author.password);

        if (isPassword) {
            const token = jwt.sign({ aId: author._id!.toString() }, process.env.SECRET_KEY!, { algorithm: 'HS256' });

            return token;
        } else {
            throw new CustomError(HttpStatusConstants.INVALID_DATA.httpStatusCode, "Wrong credemtials")
        }
    }

    static async updateDetails(authorDetails: authorInterface, authorId: string): Promise<void> {
        authorDetails.password = await bcrypt.hash(authorDetails.password, 10);

        const author: authorInterface | null = await Author.findByIdAndUpdate(authorId, authorDetails);

        if (!author) {
            throw new CustomError(HttpStatusConstants.RESOURCE_NOT_FOUND.httpStatusCode, "Author not found")
        } else {
            await author.save();
        }
    }

    static async deleteDetails(authorId: string): Promise<void> {
        const author: authorInterface | null = await Author.findByIdAndDelete(authorId);

        if (!author) {
            throw new CustomError(HttpStatusConstants.RESOURCE_NOT_FOUND.httpStatusCode, "Author not found")
        }
    }

    static async getAuthor(page: number, limit: number, query: any) {
        return await Author.find(query).skip((page - 1) * limit).limit(limit);
    }
}