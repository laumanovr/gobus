import {sendGetRequest} from "@/services/api.service";

export class BookingService {
	constructor() {
	}

	static fetchBookings(tripId) {
		const url = `bookings?limit=100&tripId=${tripId}`;
		return sendGetRequest(url);
	}
}
