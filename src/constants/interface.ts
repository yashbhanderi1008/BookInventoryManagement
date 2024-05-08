import { Document, Types } from "mongoose"

export interface bookInterface extends Document{
    bookTitle: string
    author: Types.ObjectId
    category: Types.ObjectId
    ISBN: number
    description: string
    price: number
}

export interface authorInterface extends Document{
    authorName: string
    biography: string
    nationality: string
    password: string
}

export interface categoryInterface extends Document{
    categoryName: string
    description: string
}

export interface adminInterface extends Document {
    userName: string,
    password: string
}