import {sendGetRequest, sendPatchRequest} from "@/services/api.service";

export class PassengerService {
	constructor() {
	}

	static fetchPassengerList(page=1, queryParam='') {
		const url = `users?limit=10&page=${page}${queryParam}`;
		return sendGetRequest(url);
	}

	static editVoucherBalance(userId, body) {
	  const url = `users/${userId}/vouchers`;
		return sendPatchRequest(url, body);
	}
}
