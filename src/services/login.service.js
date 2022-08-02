import {sendPostRequest} from "@/services/api.service";
import router from '../router';

export class LoginService {
	constructor() {
	}

	static onLogin(body) {
		const url = '';
		const resp = sendPostRequest(url, body);
		window.localStorage.setItem('busAdmin', JSON.stringify(resp));
		router.push('/manage');
		return resp;
	}

	static onLogOut() {
		window.localStorage.removeItem('busAdmin');
		router.push('/');
	}
}
