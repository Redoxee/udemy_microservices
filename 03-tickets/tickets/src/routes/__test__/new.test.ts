import request from 'supertest';
import { Ticket } from '../../models/tickets';

import { app } from '../../app';

import { natsWrapper } from '../../nats-wrapper';

it('has a route handler listening to /api/tickets for post requests', async () => {
	const response = await request(app)
		.post('/api/tickets')
		.send({});
	
	expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
	await request(app)
		.post('/api/tickets')
		.send({}).expect(401);
});

it('returns a status other than 401 if user is signed in', async () => {
	const response = await request(app)
		.post('/api/tickets')
		.set('Cookie',signin())
		.send({});

	expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid title is provided', async () => {
	await request(app)
		.post('/api/tickets')
		.set('Cookie',signin())
		.send({
			title: '',
			price:'10'
		})
		.expect(400);

		await request(app)
		.post('/api/tickets')
		.set('Cookie',signin())
		.send({
			price:'10'
		})
		.expect(400);
});

it('returns an error if an invalid price is provided', async () => {
	await request(app)
		.post('/api/tickets')
		.set('Cookie',signin())
		.send({
			title: 'fsdfds',
			price: -10
		})
		.expect(400);

		await request(app)
		.post('/api/tickets')
		.set('Cookie',signin())
		.send({
			title:'fgdf'
		})
		.expect(400);

});

it('create a ticket with valid input', async () => {
	let tickets = await Ticket.find();
	expect(tickets.length).toEqual(0);

	await request(app)
		.post('/api/tickets')
		.set('Cookie',signin())
		.send({
			title:'fgdf',
			price: 300
		})
	.expect(201);

	tickets = await Ticket.find();
	expect(tickets.length).toEqual(1);
});

it('publishes an event', async ()=> {
	let tickets = await Ticket.find();
	expect(tickets.length).toEqual(0);

	await request(app)
		.post('/api/tickets')
		.set('Cookie',signin())
		.send({
			title:'fgdf',
			price: 300
		})
	.expect(201);
	
	expect(natsWrapper.client.publish).toHaveBeenCalled();
});