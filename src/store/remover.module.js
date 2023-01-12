const state = {
	deleteItemId: '',
	selectedService: {},
	body: {},
	onDelete: 0
};

const actions = {
	setItemId({commit}, value) {
		commit('UPDATE_ITEM_ID', value);
	},
	setSelectedService({commit}, value) {
		commit('UPDATE_SELECTED_SERVICE', value);
	},
	setDeleteKey({commit}, value) {
		commit('UPDATE_DELETE_KEY', value);
	},
	setDeleteBody({commit}, value) {
	  commit('UPDATE_DELETE_BODY', value);
	}
};

const mutations = {
	UPDATE_ITEM_ID(state, value) {
		state.deleteItemId = value;
	},
	UPDATE_SELECTED_SERVICE(state, value) {
		state.selectedService = value;
	},
	UPDATE_DELETE_KEY(state, value) {
		state.onDelete = value;
	},
	UPDATE_DELETE_BODY(state, value) {
	  state.body = value;
	}
};

export default {
	namespaced: true,
	state,
	actions,
	mutations
};
