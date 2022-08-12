import Vue from 'vue';
import Vuex from 'vuex';
import LoaderStore from './loader.module';
import RemoverStore from './remover.module';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		LoaderStore,
		RemoverStore
	}
});
