// eslint-disable-next-line no-unused-vars
import {sendPostRequest, sendGetRequest, sendPatchRequest} from "@/services/api.service";

export class DriverService {
	constructor() {
	}

	static fetchDriverList(queryParam='') {
		const url = `drivers?page=1${queryParam}`;
		return sendGetRequest(url);
	}

	static fetchDriverReviews(driverId) {
	  const url = `drivers/${driverId}/reviews`;
		return sendGetRequest(url);
	}

	static create(body) {
		const url = 'drivers';
		const formData = new FormData();
		Object.entries(body).forEach((item) => formData.append(item[0], item[1]));
		return sendPostRequest(url, formData);
	}

	static update(body) {
		const url = `drivers/${body.id}`;
		delete body.image;
		if (!body.photo?.size) delete body.photo;
		const formData = new FormData();
		Object.entries(body).forEach((item) => formData.append(item[0], item[1]));
		return sendPatchRequest(url, formData);
	}

	static delete(id) {
		const url = `drivers/${id}/archive`;
		return sendPatchRequest(url, id);
	}
}
