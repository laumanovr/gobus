const state = {
	isLoading: false
};

const actions = {
	setLoader({commit}, value) {
		commit('UPDATE_LOADER', value);
	}
};

const mutations = {
	UPDATE_LOADER(state, value) {
		state.isLoading = value;
	}
};

export default {
	namespaced: true,
	state,
	actions,
	mutations
};
