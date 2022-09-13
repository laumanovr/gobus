import {sendGetRequest} from "@/services/api.service";

export class AnalyticsService {
	constructor() {
	}

	static fetchStationBookCount(queryParam='') {
		const url = `stations/stats${queryParam}`;
		return sendGetRequest(url);
	}
}
