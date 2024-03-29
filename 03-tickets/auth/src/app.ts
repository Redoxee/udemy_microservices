import express from "express";
import 'express-async-errors';
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { currentUserRouter } from "./routes/current-users";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";

import { errorHandler } from '@amgtickets/common';
import { NotFoundError } from '@amgtickets/common';

const app = express();
app.use(json());
app.set('trust proxy', true);
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test',
    })
);

app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
app.use(currentUserRouter);

app.all('*',()=>{throw new NotFoundError()});
app.use(errorHandler);


export { app };