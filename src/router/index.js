import Vue from "vue";
import VueRouter from "vue-router";
import Chat from "../views/Chat.vue";

Vue.use(VueRouter);

const routes = [
	{
		path: "/",
		name: "chat",
		component: Chat,
		meta: {
			requireAuth: true // 只要此字段为true，必须做鉴权处理
		}
	},
	// {
	// 	path: "/info",
	// 	name: "info",
	// 	component: () => import("../views/Info.vue"),
	// 	meta: {
	// 		requireAuth: true // 只要此字段为true，必须做鉴权处理
	// 	}
	// },
	{
		path: "/login",
		name: "login",
		component: () => import("../views/Login.vue")
	}
];

const router = new VueRouter({
	mode: "hash",
	base: process.env.BASE_URL,
	routes
});

export default router;
