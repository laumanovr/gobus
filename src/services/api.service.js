import axios from "axios";
import {authHeader} from "@/utils/authHeader";

// const BASE_URL = 'http://18.216.111.140:3000/api/v1';
const BASE_URL = 'https://api.gobus.kg/api/v1';

export const sendGetRequest = (url) => sendRequest('GET', url);

export const sendPostRequest = (url, data) => sendRequest('POST', url, data);

export const sendPutRequest = (url, data) => sendRequest('PUT', url, data);

export const sendPatchRequest = (url, data) => sendRequest('PATCH', url, data);

export const sendDeleteRequest = (url, data) => sendRequest('DELETE', url, data);

const sendRequest = async (method, finalUrl, data) => {
	const url = `${BASE_URL}/${finalUrl}`;
	const isFormData = data instanceof FormData;
	const config = {
		method,
		url,
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
		return res.data;
	} catch (err) {
		return Promise.reject(err?.response?.data?.message);
	}
};
