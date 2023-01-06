import {sendGetRequest, sendPostRequest} from "@/services/api.service";

export class BookingService {
	constructor() {
	}

	static fetchBookings(queryParam='') {
		const url = `bookings?limit=10${queryParam}`;
		return sendGetRequest(url);
	}

	static fetchAllTripBookings(tripId) {
	  const url = `trips/${tripId}/seats`;
	  return sendGetRequest(url);
	}

	static create(tripId, body) {
	  const url = `trips/${tripId}/bookings`;
		return sendPostRequest(url, body);
	}
}
