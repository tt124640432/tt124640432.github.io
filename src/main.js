import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

//加载必须要的core，demo简化起见采用的直接加载类库，实际使用时应当采用异步按需加载
import Import_Recorder from "recorder-core";
//需要使用到的音频格式编码引擎的js文件统统加载进来
import "recorder-core/src/engine/mp3";
import "recorder-core/src/engine/mp3-engine";
//可选的扩展
import "recorder-core/src/extensions/waveview";

import Toast from "vue-easy-toast";

Vue.config.productionTip = false;

Vue.use(Toast);

router.beforeEach((to, from, next) => {
	// 路由进入下一个路由对象前，判断是否需要登陆
	console.log("store", store, store.state.id);

	if (to.matched.some(res => res.meta.requireAuth)) {
		// let userData = getUserData();
		// 未登录和已经登录的处理
		if (!store.state.id) {
			// 执行到此处说明没有登录，君可按需处理之后再执行如下方法去登录页面
			next({
				path: "/login"
				// query: {
				// 	redirect: to.fullPath
				// }
			});
			// } else {
			// 	// 用户信息是否过期验证
			// 	let overdueTime = userData.overdueTime;
			// 	let nowTime = +new Date();
			// 	// 登陆过期和未过期
			// 	if (nowTime > overdueTime) {
			// 		next({
			// 			path: "/login",
			// 			query: {
			// 				redirect: to.fullPath
			// 			}
			// 		});
		} else {
			next();
		}
		// }
	} else {
		next();
	}
});
new Vue({
	router,
	store,
	data: {
		Rec: Import_Recorder
	},
	methods: {
		toast: function(msg) {
			this.$toast(msg, {
				duration: 1000,
				mode: "override",
				closeable: false,
				horizontalPosition: "center",
				verticalPosition: "top",
				transition: "fade",
				className: ["", "my-class"],

				customClass: ".et-wrapper.my-class {background-color: red;}"
			});
		}
	},
	render: h => h(App)
}).$mount("#app");
