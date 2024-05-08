import express from "express";
import { categoryControl } from "../controllers/categoryController";
import { authorizeAdmin } from "../middlewares/authentication";
const route = express.Router();

route.post('/addCategory', authorizeAdmin, categoryControl.addCategory);
route.patch('/categoryUpdate/:categoryId', authorizeAdmin, categoryControl.updateCategory);
route.delete('/categoryDelete/:categoryId', authorizeAdmin, categoryControl.deleteCategory);

export default route;