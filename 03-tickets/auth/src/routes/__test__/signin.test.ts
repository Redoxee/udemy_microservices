import request from 'supertest';
import { app } from '../../app';

it('Expect 400 on non existant email', async () => {
	await request(app)
		.post('/api/users/signin')
		.send({
			email: 'test@test.test',
			password: 'password'
		})
		.expect(400);
});

it('Expect 400 on wrong password', async () => {
	await request(app)
		.post('/api/users/signup')
		.send({
			email: 'test@test.test',
			password: 'password'
		})
		.expect(201);

	await request(app)
		.post('/api/users/signin')
		.send({
			email: 'test@test.test',
			password: 'wrong password'
		})
		.expect(400);
});

it('Response with a cookie on correct credential', async () => {
	await request(app)
		.post('/api/users/signup')
		.send({
			email: 'test@test.test',
			password: 'password'
		})
		.expect(201);

	const res = await request(app)
		.post('/api/users/signin')
		.send({
			email: 'test@test.test',
			password: 'password'
		})
		.expect(200);
	expect(res.get('Set-Cookie')).toBeDefined();
});