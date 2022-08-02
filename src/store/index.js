import Vue from 'vue';
import Vuex from 'vuex';
import LoaderStore from './loader.module';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		LoaderStore
	}
});
