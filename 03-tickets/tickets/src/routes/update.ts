import express, {Request, Response} from "express";
import { body } from "express-validator";
import {
	validateRequest,
	NotFoundError,
	requireAuth,
	NotAuthorizeError
} from '@amgtickets/common';

import { Ticket } from "../models/tickets";
import { natsWrapper } from "../nats-wrapper";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";

const router = express.Router();

router.put('/api/tickets/:id',
	requireAuth,
	[
		body('title').not().isEmpty().withMessage('Title must not be empty'),
		body('price').isFloat({gt : 0}).withMessage('Price must be Greater than 0'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const ticket = await Ticket.findById(req.params.id);
		if(!ticket) {
			throw new NotFoundError();
		}
		
		if (ticket.userId !== req.currentUser!.id) {
			throw new NotAuthorizeError();
		}

		ticket.set({
			title: req.body.title,
			price: req.body.price
		});

		await ticket.save();
		
		new TicketUpdatedPublisher(natsWrapper.client).publish({
			id: ticket.id,
			title: ticket.title,
			price: ticket.price,
			userId: ticket.userId,
		});

		res.send(ticket);
});

export { router as updateRouter };