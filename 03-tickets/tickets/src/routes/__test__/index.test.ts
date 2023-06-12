import request from 'supertest';
import { app } from '../../app';

async function createTickets() {
		await request(app)
		.post('/api/tickets')
		.set('Cookie', global.signin())
		.send({
			title: 'first ticket',
			price: 20
		});

		await request(app)
			.post('/api/tickets')
			.set('Cookie', global.signin())
			.send({
				title: 'second ticket',
				price: 20
			});

		await request(app)
			.post('/api/tickets')
			.set('Cookie', global.signin())
			.send({
				title: 'third ticket',
				price: 20000
			});
}

it('returns list of tickets', async () => {
	await createTickets();

	const response = await request(app)
		.get('/api/tickets')
		.send()
		.expect(200);
	
	expect(response.body.length).toEqual(3);
});