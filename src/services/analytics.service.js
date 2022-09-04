import {sendGetRequest} from "@/services/api.service";

export class AnalyticsService {
	constructor() {
	}

	static fetchStationCount() {
		const url = 'stations/stats';
		return sendGetRequest(url);
	}
}
