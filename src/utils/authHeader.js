export const authHeader = () => {
	const user = JSON.parse(window.localStorage.getItem('busAdmin'));
	if (user && user.token) {
		return {Authorization: `Bearer ${user.token}`};
	}
	return {};
};
