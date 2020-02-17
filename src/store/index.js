import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
Vue.use(Vuex);

export default new Vuex.Store({
	plugins: [createPersistedState({ storage: sessionStorage })],
	state: {
		id: "",
		userInfo: {
			avatar: "",
			nickname: "",
			cellphone: ""
		}
	},
	mutations: {
		setUserId(state, id) {
			return (state.id = id);
		},
		setUserInfo(state, userInfo) {
			return (state.userInfo = userInfo);
		}
	},
	actions: {
		setUserId(context, id = "") {
			context.commit("setUserId", id);
		},
		setUserInfo(context, userInfo) {
			context.commit("setUserInfo", userInfo);
		}
	},
	modules: {}
});
