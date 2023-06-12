import mongoose from 'mongoose';
import express, { Request, Response } from "express";
import { NotFoundError, requireAuth, validateRequest, BadRequestError } from "@amgtickets/common";
import { body } from 'express-validator';
import { Ticket } from '../models/tickets';
import { Order, OrderStatus } from '../models/orders';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 30 * 60;

router.post('/api/orders',
	requireAuth,
	[
		body('ticketId').not().isEmpty()
		.custom((input:string)=>{
			return mongoose.Types.ObjectId.isValid(input)
		}).withMessage('Ticket Id must be provided')
	],
	validateRequest
	, async (req: Request, res: Response)=> {
	
	const {ticketId} = req.body;
	
	// Find the ticket ordered
	const ticket = await Ticket.findById(ticketId);
	if(!ticket){
		throw new NotFoundError();
	}

	// Make sure that this ticket is available
	const isReserved = await ticket.isReserved();

	if (isReserved) {
		throw new BadRequestError('Ticket is already reserved');
	}
	
	// Compute an expiration date
	const expiration = new Date();
	expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

	// Build the order and save it
	const order = Order.build({
		userId: req.currentUser!.id,
		status: OrderStatus.Created,
		expireAt: expiration,
		ticket: ticket
	});

	await order.save();

	// Notify the rest of the applications
	res.status(201).send(order);
});

export { router as newOrderRouter };