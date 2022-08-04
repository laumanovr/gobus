import {sendPostRequest} from "@/services/api.service";
import router from '../router';

export class LoginService {
	constructor() {
	}

	static async onLogin(body) {
	  try {
			const url = 'login';
			const resp = await sendPostRequest(url, body);
			const busAdmin = Object.assign({}, resp.data.user, {token: resp.token});
			window.localStorage.setItem('busAdmin', JSON.stringify(busAdmin));
			await router.push('/manage');
			return resp;
		} catch (err) {
			return Promise.reject(err);
		}
	}

	static onLogOut() {
		window.localStorage.removeItem('busAdmin');
		return router.push('/');
	}
}
