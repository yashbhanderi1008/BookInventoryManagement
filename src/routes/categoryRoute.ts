import express from "express";
import { categoryControl } from "../controllers/categoryController";
const route = express.Router();

route.post('/addCategory', categoryControl.addCategory);
route.patch('/categoryUpdate/:categoryId', categoryControl.updateCategory);
route.delete('/categoryDelete/:categoryId', categoryControl.deleteCategory);

export default route;