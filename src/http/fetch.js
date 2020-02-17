import qs from "qs";
import Store from "../store";
// import { getUserData, removeUserData } from "@utils";

/*
 * 根据环境变量进行接口区分
 */
let baseURL = "";
let baseURLArr = [
	{
		type: "development",
		url: "/apis"
	},
	{
		type: "production",
		url: "/api"
	}
];
console.log("process.env.NODE_ENV", process.env.NODE_ENV);
console.log("process.env.PUBLIC_URL", process.env.PUBLIC_URL);
baseURLArr.forEach(item => {
	if (process.env.NODE_ENV === item.type) {
		baseURL = item.url;
	}
});

export default function request(url, options = {}) {
	url = baseURL + url;

	/*
	 * 合并配置项
	 */
	options = Object.assign(
		{
			// 允许跨域携带资源凭证 same-origin同源可以  omit都拒绝
			credentials: "include",
			// 设置请求头
			headers: {
				// "source-type": 1,
				timestamp: +new Date()
			}
		},
		options
	);
	options.headers.Accept = "application/json";

	/*
	 * token的校验
	 */
	// 获取token，配置请求头
	// const token = getUserData().token;
	// const OverdueTime = getUserData().overdueTime;
	// const token = localStorage.getItem("token");
	// token && (options.headers.Authorization = token);
	// token && (options.headers.token = token);
	options.headers.Authorization = Store.state.id;

	//请求接口时验证token是否过期
	// if (OverdueTime && OverdueTime < +new Date()) {
	// removeUserData();s
	// if (window.location.pathname !== "/login") {
	// 	let fullPath = window.location.href.replace(window.location.origin, "");
	// 	window.location.href = "/login?redirect=" + encodeURIComponent(fullPath);
	// }
	// }

	/*
	 * GET系列请求的处理
	 */
	if (!options.method) options.method = "GET";
	if (options.hasOwnProperty("params")) {
		if (/^(GET|DELETE|HEAD|OPTIONS)$/i.test(options.method)) {
			const ask = url.includes("?") ? "&" : "?";
			url += `${ask}${qs.stringify(options.params)}`;
		}
		delete options.params;
	}
	/*
	 * POST请求的处理
	 */
	if (/^(POST|PUT)$/i.test(options.method)) {
		if (!options.type) options.type = "urlencoded";
		if (options.type === "urlencoded") {
			options.headers["Content-Type"] = "application/x-www-form-urlencoded";
			options.body = qs.stringify(options.body);
		}
		if (options.type === "json") {
			options.headers["Content-Type"] = "application/json";
			options.body = JSON.stringify(options.body);
		}
	}

	return fetch(url, options)
		.then(response => {
			if (!/^(2|3)\d{2}$/.test(response.status)) {
				switch (response.status) {
					case 401: // 当前请求需要用户验证（一般是未登录）
						break;
					case 403: // 服务器已经理解请求，但是拒绝执行它（一般是TOKEN过期）
						// removeUserData();
						// 跳转到登录页
						break;
					case 404: // 请求失败，请求所希望得到的资源未被在服务器上发现
						break;
				}
				return Promise.reject(response);
			}
			return response.data ? response.data.json() : response.json();
		})
		.catch(error => {
			// 断网处理
			if (!window.navigator.onLine) {
				// 断开网络了，可以让其跳转到断网页面
				return;
			}
			console.warn("fetch error", error);
			return Promise.reject(error);
		});
}
