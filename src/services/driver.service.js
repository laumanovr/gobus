// eslint-disable-next-line no-unused-vars
import {sendPostRequest, sendGetRequest, sendPatchRequest} from "@/services/api.service";

export class DriverService {
	constructor() {
	}

	static fetchDriverList() {
		const url = 'drivers';
		return sendGetRequest(url);
	}

	static create(body) {
		const url = 'drivers';
		return sendPostRequest(url, body);
	}

	static update(body, id) {
		const url = `drivers/${id}`;
		return sendPatchRequest(url, body);
	}

	static delete(id) {
		const url = `drivers/${id}/archive`;
		return sendPatchRequest(url, id);
	}
}
