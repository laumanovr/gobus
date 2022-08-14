import {sendGetRequest, sendPostRequest} from "@/services/api.service";

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
}
