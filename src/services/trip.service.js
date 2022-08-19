import {sendGetRequest, sendPatchRequest, sendPostRequest} from "@/services/api.service";

export class TripService {
	constructor() {}

	static fetchTripList(date='', driverId='') {
	  let url = 'trips';
		if (date) url = `trips?date=${date}`;
		if (driverId) url = `trips?driverId=${driverId}`;
		if (date && driverId) url = `trips?date=${date}&driverId=${driverId}`;
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
