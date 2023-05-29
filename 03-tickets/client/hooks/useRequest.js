import axios from "axios";
import { useState } from "react";

function useRequest({url, method, body, onSuccess}) {
	const [errors, setErrors] = useState(null);
	const doRequest = async () => {
		try {
			setErrors(null);
			const response = await axios[method](url, body);
			onSuccess(response.data);
			return response.data;
		}
		catch (err) {
			if(!err.response)
			{
				throw err;
			}

			console.log(err);
			const errMessage = <div className='alert alert-danger'>
				<h4>Oups</h4>
				<ul className='my-0'>
					{err.response.data.map(e => <li key={e.message}>{e.message}</li>)}
				</ul>
			</div>
			setErrors(errMessage);
		}
	};


	return {doRequest, errors};
}

export default useRequest;