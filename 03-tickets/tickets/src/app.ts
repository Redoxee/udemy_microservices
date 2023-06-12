import express from "express";
import 'express-async-errors';
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { errorHandler } from '@amgtickets/common';
import { NotFoundError } from '@amgtickets/common';
import { currentUser } from "@amgtickets/common";

import { createTicketRouter } from "./routes/new";
import { showRouter } from "./routes/show";
import { indexRouter } from "./routes/index";
import { updateRouter } from "./routes/update"

const app = express();
app.use(json());
app.set('trust proxy', true);
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test',
    })
);

app.use(currentUser);

app.use(indexRouter);
app.use(createTicketRouter);
app.use(showRouter);
app.use(updateRouter);

app.all('*',()=>{throw new NotFoundError()});
app.use(errorHandler);



export { app };