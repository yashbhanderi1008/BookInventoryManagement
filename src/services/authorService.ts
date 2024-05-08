import { authorInterface } from "../constants/interface";
import Author from "../models/authorModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class authorService {
    static async createAuthor(authorDetails: authorInterface): Promise<void> {
        if (await Author.findOne({ authorName: authorDetails.authorName })) {
            throw new Error("Author already exists");
        }

        authorDetails.password = await bcrypt.hash(authorDetails.password, 10);

        const newAuthor = new Author(authorDetails);

        await newAuthor.save();
    }

    static async login(authorName: string, password: string): Promise<string> {
        const author = await Author.findOne({ authorName: authorName });

        if (!author) {
            throw new Error("Author doesn't exists");
        }

        const isPassword = await bcrypt.compare(password, author.password);

        if (isPassword) {
            const token = jwt.sign({ aId: author._id!.toString() }, process.env.SECRET_KEY!, { algorithm: 'HS256' });

            return token;
        } else {
            throw new Error("Wrong credemtials");
        }
    }

    static async updateDetails(authorDetails: authorInterface, authorId: string): Promise<void> {
        authorDetails.password = await bcrypt.hash(authorDetails.password, 10);

        const author: authorInterface | null = await Author.findByIdAndUpdate(authorId, authorDetails);

        if (!author) {
            throw new Error("Author not found");
        } else {
            await author.save();
        }
    }

    static async deleteDetails(authorId: string): Promise<void> {
        await Author.findByIdAndDelete(authorId);
    }

    static async getAuthor(page: number, limit: number, query: any) {
        return await Author.find(query).skip((page - 1) * limit).limit(limit);
    }
}