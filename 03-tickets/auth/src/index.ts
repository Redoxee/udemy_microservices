import mongoose from "mongoose";
import { DatabaseConnectionError } from '@amgtickets/common';

import { app } from './app'

const start = async() => {

    if(!process.env.JWT_KEY) {
        throw new Error('Missing env secret JWT_KEY');
    }

    if(!process.env.MONGO_URI) {
        throw new Error('Missing env MONGO_URI');
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);

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