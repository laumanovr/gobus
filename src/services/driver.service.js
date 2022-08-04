import {sendPostRequest, sendGetRequest, sendDeleteRequest, sendPatchRequest} from "@/services/api.service";

export class DriverService {
	constructor() {
	}

	static fetchDriverList() {
		const url = 'drivers';
		return sendGetRequest(url);
	}

	static createDriver(body) {
		const url = 'drivers';
		return sendPostRequest(url, body);
	}

	static updateDriver(body) {
		const url = '';
		return sendPatchRequest(url, body);
	}

	static deleteDriver(id) {
		const url = '';
		return sendDeleteRequest(url, id);
	}
}
