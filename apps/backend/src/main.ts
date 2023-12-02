import mongoose from 'mongoose';
import express, { ErrorRequestHandler } from 'express';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session'
import dotenv from 'dotenv';
import accountRouter from './routes/account';

dotenv.config();
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cluster0';
mongoose.connect(MONGO_URI);

const app = express();
const port = 8080;

app.use(bodyParser.json());
app.use(cookieSession({
    keys: ['cis1962']
}));

const handler : ErrorRequestHandler = (err: Error, _req, res, next) => {
    res.status(400).send(err.message);
    next();
}
app.use(handler);

app.use('/account', accountRouter);
app.listen(port, () => {})