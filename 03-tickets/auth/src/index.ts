import express from "express";
import 'express-async-errors';
import { json } from "body-parser";
import mongoose from "mongoose";
import cookieSession from "cookie-session";

import { currentUserRouter } from "./routes/current-users";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";

import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from "./errors/not-found-error";
import { DatabaseConnectionError } from "./errors/database-connection-error";

const app = express();
app.use(json());
app.set('trust proxy', true);
app.use(
    cookieSession({
        signed: false,
        secure: true,
    })
);

app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
app.use(currentUserRouter);

app.all('*',()=>{throw new NotFoundError()});
app.use(errorHandler);

const start = async() => {

    if(!process.env.JWT_KEY) {
        throw new Error('Missing env secret JWT_KEY');
    }

    try {
        await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");

        console.log('Mongodb connection done.')
    } catch(err) {
        console.log(err);
        throw new DatabaseConnectionError();
    }

    const port = 3000;
    app.listen(port, ()=>{
        console.log(`listening on port ${port}`);
    });
} 

start();