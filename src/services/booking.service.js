import {sendGetRequest, sendPostRequest} from "@/services/api.service";

export class BookingService {
	constructor() {
	}

	static fetchBookings(tripId) {
		const url = `bookings?limit=100&tripId=${tripId}`;
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
