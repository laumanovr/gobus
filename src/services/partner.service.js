import {sendGetRequest, sendPostRequest, sendPatchRequest} from "@/services/api.service";

export class PartnerService {
	constructor() {}

	static fetchPartnerList() {
		const url = 'partners';
		return sendGetRequest(url);
	}

	static create(body) {
		const url = 'partners';
		return sendPostRequest(url, body);
	}

	static update(body) {
	  const url = `partners/${body.id}`;
	  return sendPatchRequest(url, body);
	}

	static delete(id, body) {
		const url = `partners/${id}`;
		return sendPatchRequest(url, body);
	}
}
