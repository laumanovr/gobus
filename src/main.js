import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import VModal from 'vue-js-modal';
import VueToast from 'vue-toast-notification';
import {VueMaskDirective} from "v-mask";
import './assets/styles/main.scss';

Vue.config.productionTip = false;
Vue.directive("mask", VueMaskDirective);
Vue.use(VModal);
Vue.use(VueToast, {position: 'top-right', duration: 2000});

new Vue({
	router,
	store,
	vuetify,
	render: h => h(App)
}).$mount('#app');
