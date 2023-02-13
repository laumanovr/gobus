import {sendGetRequest} from "@/services/api.service";

export class AnalyticsService {
	constructor() {
	}

	static fetchStationBookCount(queryParam='') {
		const url = `stations/stats${queryParam}`;
		return sendGetRequest(url);
	}

	static fetchTripAccounting(queryParam='') {
	  const url = `trips/analytics?limit=20${queryParam}`;
	  return sendGetRequest(url);
	}
}
