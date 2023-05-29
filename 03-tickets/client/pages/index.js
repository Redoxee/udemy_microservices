import Router from "next/router";

import buildClient from '../api/build-client';

const index = (pageProps) => {
	return pageProps.currentUser ? <h1>Signed in</h1> : <h1>Not signed in</h1>
}

index.getInitialProps = async context => {
	const client = buildClient(context);
	const { data } = await client.get('/api/users/currentuser');

	return data;
};
export default index;