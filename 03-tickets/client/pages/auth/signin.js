import { useState } from 'react';
import Router from 'next/router';

import useRequest from '../../hooks/useRequest';

function signin() {

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const {doRequest, errors} = useRequest({
		url: '/api/users/signin',
		method: 'post',
		body: {email, password},
		onSuccess: ()=> Router.push('/')
	});

	let handleEmailChange = (e) => {
		setEmail(e.target.value);
	}

	let handlePasswordChange = (e) => {
		setPassword(e.target.value);
	}

	let handleSubmit = async (e)=> {
		e.preventDefault();
		
		try {
			const response = await doRequest();
			console.log(response);
		}
		catch(err) {
			console.log(err);
		}
	}

	return <form onSubmit={handleSubmit}>
		<h1>Sign In</h1>
		<div className="form-group">
			<label>Email Adress</label>
			<input className="from-control" onChange={handleEmailChange} value={email}></input>
		</div>

		<div className="form-group">
			<label>Password</label>
			<input type="password" onChange={handlePasswordChange} value={password} className="from-control"></input>
		</div>
		{errors}
		<button className="btn btn-primary">Sign In</button>
	</form>
}

export default signin;