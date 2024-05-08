import express from "express";
import { authorControl } from "../controllers/authorController";
import { authorizeAuthor } from "../middlewares/authentication";
const route = express.Router();

route.post('/signUp', authorControl.signUpAuthor);
route.post('/login', authorControl.loginAuthor);
route.patch('/authorUpdate', authorizeAuthor, authorControl.updateAuthor);
route.delete('/authorDelete', authorizeAuthor, authorControl.deleteAuthor);
route.post('/addBook', authorizeAuthor, authorControl.addBook);
route.patch('/bookUpdate/:bookId', authorizeAuthor, authorControl.updateBook);
route.delete('/bookDelete/:bookId', authorizeAuthor, authorControl.deleteBook);
route.get('/getBook', authorizeAuthor, authorControl.retriveBook);

export default route;