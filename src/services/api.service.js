import axios from "axios";
import {authHeader} from "@/utils/authHeader";

const BASE_URL = '';

export const sendGetRequest = (url) => sendRequest('GET', url);

export const sendPostRequest = (url, data) => sendRequest('POST', url, data);

export const sendPutRequest = (url, data) => sendRequest('PUT', url, data);

export const sendPatchRequest = (url, data) => sendRequest('PATCH', url, data);

export const sendDeleteRequest = (url, data) => sendRequest('DELETE', url, data);

const sendRequest = async (method, url, data) => {
	const finalUrl = `${BASE_URL}/${url}`;
	const isFormData = data instanceof FormData;
	const config = {
		method,
		finalUrl,
		headers: {
			...authHeader(),
			'Content-Type': !isFormData ? 'application/json' : '',
		},
	};
	if (data) {
		config.data = isFormData ? data : JSON.stringify(data);
	}
	try {
		const res = await axios(config);
		debugger;
		return res.data;
	} catch (err) {
		debugger;
		return Promise.reject(err.response.data.message);
	}
};
