import {sendGetRequest, sendPostRequest, sendPatchRequest} from "@/services/api.service";

export class TransportService {
	constructor() {}

	static fetchTransportList() {
		const url = 'vehicles';
		return sendGetRequest(url);
	}

	static create(body) {
		const url = 'vehicles';
		return sendPostRequest(url, body);
	}

	static update(body) {
		const url = `vehicles/${body.id}`;
		return sendPatchRequest(url, body);
	}

	static modifySeatPrice(id, body) {
	  const url = `vehicles/${id}`;
	  return sendPatchRequest(url, body);
	}
}
