import {sendGetRequest, sendPatchRequest, sendPostRequest} from "@/services/api.service";

export class TripService {
	constructor() {}

	static fetchTripList() {
		const url = 'trips';
		return sendGetRequest(url);
	}

	static create(body) {
		const url = 'trips';
		return sendPostRequest(url, body);
	}

	static update(body) {
		const url = `trips/${body.id}`;
		return sendPatchRequest(url, body);
	}
}
