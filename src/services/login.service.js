import {sendPostRequest} from "@/services/api.service";
import router from '../router';
const roles = [{role: 'ADMIN', url: '/manage'}, {role: 'PARTNER', url: '/partner-manage'}];

export class LoginService {
	constructor() {
	}

	static async onLogin(body) {
	  try {
			const url = 'login';
			const resp = await sendPostRequest(url, body);
			const busAdmin = Object.assign({}, resp.data.user, {token: resp.token});
			window.localStorage.setItem('busAdmin', JSON.stringify(busAdmin));
			const role = roles.find((item) => item.role === busAdmin.role);
			await router.push(role.url);
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
