import express from "express";
import { adminControl } from "../controllers/adminController";
import { authorizeAdmin } from "../middlewares/authentication";
const route = express.Router();

route.post('/signUp', adminControl.signUpAdmin);
route.post('/login', adminControl.loginAdmin);
route.post('/addBook', authorizeAdmin, adminControl.addBook);
route.patch('/bookUpdate/:bookId', authorizeAdmin, adminControl.updateBook);
route.delete('/bookDelete/:bookId', authorizeAdmin, adminControl.deleteBook);
route.get('/getAuthor', authorizeAdmin, adminControl.retriveAuthor);
route.get('/getCategory', authorizeAdmin, adminControl.retriveCategory);
route.get('/getBook', authorizeAdmin, adminControl.retriveBook);

export default route;