import request from "./fetch";

//用户登录
export function loginApi(params) {
	return request(`/sign`, {
		method: "post",
		body: params
	});
}

//新增⽤用户
export function adduserApi(params) {
	return request(`/adduser`, {
		method: "post",
		body: params
	});
}

//用户信息设置
export function setuserApi(params) {
	return request(`/user/setuser`, {
		method: "post",
		body: params
	});
}

//⽤户退出
export function exitApi() {
	return request(`/exit`, {
		method: "GET"
	});
}

//获取当天聊天记录
export function recordsApi(params) {
	return request(`/user/records`, {
		method: "post",
		body: params
	});
}
