import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '../views/LoginPage.vue';
import {checkPermission} from "@/utils/checkPermission";

const isComponent = (path) => () => import(`@/views/manage/${path}.vue`);

Vue.use(VueRouter);

const routes = [
	{
		path: '/',
		name: 'login',
		component: Login,
		meta: {
			requireAuth: false
		}
	},

	{
		path: '/manage',
		component: isComponent('AdminManage'),
		beforeEnter: (to, from, next) => {
		  checkPermission(to, from, next);
		},
		children: [
			{
				path: '',
				name: 'passenger',
				component: isComponent('AdminPassenger'),
				meta: {
					requireAuth: true
				}
			},
			{
				path: 'driver',
				name: 'driver',
				component: isComponent('AdminDriver'),
				meta: {
					requireAuth: true
				}
			},
			{
				path: 'trip',
				name: 'trip',
				component: isComponent('AdminTrip'),
				meta: {
					requireAuth: true
				}
			},
			{
				path: 'stations',
				name: 'stations',
				component: isComponent('AdminStation'),
				meta: {
					requireAuth: true
				}
			},
			{
				path: 'analytics',
				name: 'analytics',
				component: isComponent('AdminAnalytics'),
				meta: {
					requireAuth: true
				}
			}
		]
	}
];

const router = new VueRouter({
	mode: 'history',
	// base: process.env.BASE_URL,
	routes
});

export default router;
