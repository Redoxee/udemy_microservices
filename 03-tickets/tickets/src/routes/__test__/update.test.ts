import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";
it('return a 404 for a non existent ticket', async() => {

	const id = new mongoose.Types.ObjectId().toHexString();

	await request(app)
		.put(`/api/tickets/${id}`)
		.set('Cookie', global.signin())
		.send({
			title: 'valid title',
			price: 30
		})
		.expect(404);
});

it('return a 401 if the user is not authenticated', async() => {
	const id = new mongoose.Types.ObjectId().toHexString();

	await request(app)
		.put(`/api/tickets/${id}`)
		.send({
			title: 'valid title',
			price: 30
		})
		.expect(401);
});

it('return a 401 if the user is not the author of the ticket', async() => {
	const response = await request(app)
		.post('/api/tickets')
		.set('Cookie', global.signin())
		.send({
			title: 'valid title',
			price: 30
		})
		.expect(201);

	const id = response.body.id;

	await request(app)
		.put(`/api/tickets/${id}`)
		.set('Cookie', global.signin())
		.send({
			title: 'other title',
			price: 30
		})
		.expect(401);
});

it('return a 400 for invalide title or price', async() => {
	const cookie = global.signin();
	const response = await request(app)
		.post('/api/tickets')
		.set('Cookie', cookie)
		.send({
			title: 'valid title',
			price: 30
		});
		
	const id = response.body.id;

	await request(app)
		.put(`/api/tickets/${id}`)
		.set('Cookie', cookie)
		.send({
			title: '',
			price: 30
		})
		.expect(400);
		
	await request(app)
		.put(`/api/tickets/${id}`)
		.set('Cookie', cookie)
		.send({
			title: 'valid title',
		})
		.expect(400);
		
	await request(app)
		.put(`/api/tickets/${id}`)
		.set('Cookie', cookie)
		.send({
			title: 'valid title',
			price: -1,
		})
		.expect(400);
});

it('return a 200 if the request is correct', async() => {
	const cookie = global.signin();
	const response = await request(app)
		.post('/api/tickets')
		.set('Cookie', cookie)
		.send({
			title: 'valid title',
			price: 30
		});
		
	const id = response.body.id;
	const newTitle = 'newTitle';
	const newPrice = 100;
	await request(app)
		.put(`/api/tickets/${id}`)
		.set('Cookie', cookie)
		.send({
			title: newTitle,
			price: newPrice
		})
		.expect(200);

	const ticketResponse = await request(app)
		.get(`/api/tickets/${id}`)
		.send();
	
		expect(ticketResponse.body.title).toEqual(newTitle);
		expect(ticketResponse.body.price).toEqual(newPrice);
});

it('publish an event', async() => {
	const cookie = global.signin();
	const response = await request(app)
		.post('/api/tickets')
		.set('Cookie', cookie)
		.send({
			title: 'valid title',
			price: 30
		});
		
	const id = response.body.id;
	const newTitle = 'newTitle';
	const newPrice = 100;
	await request(app)
		.put(`/api/tickets/${id}`)
		.set('Cookie', cookie)
		.send({
			title: newTitle,
			price: newPrice
		})
		.expect(200);

	expect(natsWrapper.client.publish).toHaveBeenCalledTimes(2);
});