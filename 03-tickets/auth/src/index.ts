import mongoose from "mongoose";
import { DatabaseConnectionError } from "./errors/database-connection-error";

import { app } from './app'

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