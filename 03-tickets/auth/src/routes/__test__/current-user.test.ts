import request from 'supertest';
import { app } from '../../app';

it('response with detail about the current user', async () => {
	const cookie = await global.signup();

	const res = await request(app)
		.get('/api/users/currentuser')
		.set('Cookie', cookie)
		.send()
		.expect(200);

		expect(res.body.currentUser.email).toEqual('test@test.test');
});

it('response with null if not autenticated', async () => {
	const res = await request(app)
		.get('/api/users/currentuser')
		.send()
		.expect(200);

		expect(res.body.currentUser).toEqual(null);
});