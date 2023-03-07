import {sendGetRequest} from "@/services/api.service";

export class AnalyticsService {
	constructor() {
	}

	static fetchStationBookCount(queryParam='') {
		const url = `stations/stats${queryParam}`;
		return sendGetRequest(url);
	}

	static fetchTripAccounting(queryParam='', count=20) {
	  const url = `trips/analytics?limit=${count}${queryParam}`;
	  return sendGetRequest(url);
	}
}
