import {sendGetRequest, sendPostRequest, sendPatchRequest} from "@/services/api.service";

export class ItineraryService {
	constructor() {}

	static fetchItineraryList() {
		const url = 'itineraries';
		return sendGetRequest(url);
	}

	static create(body) {
		const url = 'itineraries';
		return sendPostRequest(url, body);
	}

	static update(body) {
		const url = `itineraries/${body.id}`;
		return sendPatchRequest(url, body);
	}

	static updateRoutePrices(id, body) {
	  const url = `itineraries/${id}/routes`;
		return sendPatchRequest(url, body);
	}

	static delete(id) {
		const url = `itineraries/${id}/archive`;
		return sendPatchRequest(url);
	}
}
