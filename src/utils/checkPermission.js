export const checkPermission = (to, from, next) => {
	const user = JSON.parse(window.localStorage.getItem('busAdmin'));
	if (to.meta.requireAuth) {
		if (user && user.token) {
			return next();
		}
		return next('/');
	}
	return next();
};
