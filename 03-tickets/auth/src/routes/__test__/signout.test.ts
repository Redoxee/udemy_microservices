import request from 'supertest';
import { app } from '../../app';

it ('clear the cookie after signin out', async () => {
	await request(app)
		.post('/api/users/signup')
		.send({
			email: 'test@test.test',
			password: 'password'
		})
		.expect(201);

	const res = await request(app)
		.post('/api/users/signout')
		.send({})
		.expect(200);
	
	expect(res.get('Set-Cookie')).toBeDefined();
});