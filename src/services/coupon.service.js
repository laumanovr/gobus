import {sendGetRequest, sendPostRequest, sendPatchRequest} from "@/services/api.service";

export class CouponService {
	constructor() {}

	static fetchCouponList(partnerId='') {
		const url = `coupons?partnerId=${partnerId}`;
		return sendGetRequest(url);
	}

	static create(body) {
		const url = 'coupons';
		return sendPostRequest(url, body);
	}

	static delete(id, body) {
		const url = `coupons/${id}`;
		return sendPatchRequest(url, body);
	}
}
