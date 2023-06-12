import request from 'supertest';
import mongoose from 'mongoose';

import { Order, OrderStatus } from '../../models/orders';
import { Ticket } from '../../models/tickets';
import { app } from '../../app';

const buildTicket = async () => {
	const ticket = Ticket.build({
		title: 'concert',
		price: 40
	});

	await ticket.save();

	return ticket;
}

it('fetches orders for a particular user', async ()=>{
	// create tickets
	const ticketOne = await buildTicket();
	const ticketTwo = await buildTicket();
	const ticketThree = await buildTicket();

	const userOne = global.signin();
	const userTwo = global.signin();
	// create order for two users
	await request(app)
		.post('/api/orders')
		.set('Cookie', userOne)
		.send({ticketId: ticketOne.id})
		.expect(201);

	const {body: orderOne} = await request(app)
		.post('/api/orders')
		.set('Cookie', userTwo)
		.send({ticketId: ticketTwo.id})
		.expect(201);

	const {body: orderTwo} = await request(app)
		.post('/api/orders')
		.set('Cookie', userTwo)
		.send({ticketId: ticketThree.id})
		.expect(201);

	// verify that querying order takes user into account
	const response = await request(app)
		.get('/api/orders')
		.set('Cookie', userTwo)
		.expect(200);

	expect(response.body.length).toEqual(2);
	expect(response.body[0].id).toEqual(orderOne.id);
	expect(response.body[1].id).toEqual(orderTwo.id);
});