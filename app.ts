import express from 'express';
import connectDb from './src/db/connection';
import dotenv from 'dotenv';
import authorRoute from './src/routes/authorRoute'
import categoryRoute from './src/routes/categoryRoute';
import adminRoute from './src/routes/adminRoute';
import ErrorHandler from './src/middlewares/errorHandler';

dotenv.config();
const app = express();
app.use(express.json());

connectDb();

app.use('/author', authorRoute);
app.use('/category', categoryRoute);
app.use('/admin', adminRoute)
app.use(ErrorHandler.errorHandlerMiddlerWare)

const port: Number = parseInt(process.env.PORT!)

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
})