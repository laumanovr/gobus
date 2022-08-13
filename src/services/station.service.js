import {sendGetRequest, sendPostRequest, sendPatchRequest} from "@/services/api.service";

export class StationService {
	constructor() {}

	static fetchStationList() {
		const url = 'stations';
		return sendGetRequest(url);
	}

	static create(body) {
		const url = 'stations';
		return sendPostRequest(url, body);
	}

	static update(body) {
		const url = `stations/${body.id}`;
		return sendPatchRequest(url, body);
	}

	static delete(id) {
		const url = `stations/${id}/archive`;
		return sendPatchRequest(url);
	}
}
