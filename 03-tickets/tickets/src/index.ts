import mongoose from "mongoose";
import { DatabaseConnectionError } from '@amgtickets/common';

import { app } from './app'
import { natsWrapper } from './nats-wrapper';

const start = async() => {

    if(!process.env.JWT_KEY) {
        throw new Error('Missing env secret JWT_KEY');
    }

    if(!process.env.MONGO_URI) {
        throw new Error('Missing env MONGO_URI');
    }

    if(!process.env.NATS_CLIENT_ID) {
        throw new Error('Missing env NATS_CLIENT_ID');
    }

    if(!process.env.NATS_CLUSTER_ID) {
        throw new Error('Missing env NATS_CLUSTER_ID');
    }

    if(!process.env.NATS_URL) {
        throw new Error('Missing env NATS_URL');
    }

    try {
        await natsWrapper.connect(
            process.env.NATS_CLUSTER_ID, 
            process.env.NATS_CLIENT_ID, 
            process.env.NATS_URL);

        natsWrapper.client.on('close', ()=>{
            console.log('NATS Connection closed');
            process.exit();
        });

        process.on('SIGINT',() => natsWrapper.client.close());
        process.on('SIGTERM',() => natsWrapper.client.close());

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