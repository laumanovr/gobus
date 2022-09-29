import {sendGetRequest, sendPatchRequest, sendPostRequest} from "@/services/api.service";

export class TripService {
	constructor() {}

	static fetchTripList(query='') {
	  const url = `trips?limit=10${query}`;
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

	static delete(id) {
	  const url = `trips/${id}/archive`;
	  return sendPatchRequest(url, {});
	}
}
