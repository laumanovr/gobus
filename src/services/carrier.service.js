import {sendGetRequest, sendPatchRequest, sendPostRequest} from "@/services/api.service";

export class CarrierService {
	constructor() {
	}

	static fetchCarrierList() {
		const url = 'carriers';
		return sendGetRequest(url);
	}

	static create(body) {
		const url = 'carriers';
		return sendPostRequest(url, body);
	}

	static update(body) {
		const url = `carriers/${body.id}`;
		return sendPatchRequest(url, body);
	}
}
