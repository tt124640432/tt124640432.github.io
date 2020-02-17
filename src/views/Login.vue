<template>
	<div class="warpBox center boxBorder">
		<div class="top">智能语音聊天室</div>
		<div class="inputBox">
			<img :src="require('../assets/images/avater.png')" alt="avater" />
			<input type="text" placeholder="请输入用户名" v-model="name" minlength="6" maxlength="20" />
			<span class="err" v-show="nameErr">不能为空</span>
		</div>
		<div class="inputBox">
			<img :src="require('../assets/images/password.png')" alt="avater" />
			<input type="password" placeholder="请输入密码" v-model="pwd" minlength="6" maxlength="20" />
			<span class="err" v-show="pwdErr">不能为空</span>
		</div>
		<div class="loginBtn btn pointer" @click="login">登录</div>
		<div class="loginBtn btn pointer" @click="adduserApi">添加用户</div>
	</div>
</template>
<script>
import { loginApi, adduserApi } from "../http";
export default {
	data() {
		return {
			name: "",
			pwd: "",
			nameErr: false,
			pwdErr: false
		};
	},
	mounted() {
		console.log("this.$store", this.$store);
	},
	methods: {
		//非空校验
		check() {
			let checked = false;
			this.nameErr = false;
			this.pwdErr = false;
			if (!this.name) {
				this.nameErr = true;
				checked = true;
			}
			if (!this.pwd) {
				this.pwdErr = true;
				checked = true;
			}
			return checked;
		},
		login() {
			console.log({ username: this.name, password: this.pwd });
			if (this.check()) return;
			loginApi({ username: this.name, password: this.pwd }).then(res => {
				console.log(res);
				if (!res.status || res.msg !== "0000") {
					this.$root.toast("登录出现问题");
					return;
				}
				this.$root.toast("登录成功");
				this.$store.dispatch("setUserId", res.obj.id);
				this.$router.push("/");
			});
		},
		adduserApi() {
			console.log({ username: this.name, password: this.pwd });
			if (this.check()) return;
			adduserApi({ username: this.name, password: this.pwd }).then(res => {
				if (!res.status || res.msg !== "0000") {
					this.$root.toast("新增出现问题");
					return;
				}
				this.$root.toast("新增成功");
			});
		}
	}
};
</script>
<style scoped>
.warpBox {
	width: 300px;
	height: 400px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding: 0 100px;
}
.loginBtn {
	width: 250px;
	line-height: 40px;
	margin-left: 50px;
	margin-bottom: 20px;
}
input {
	line-height: 40px;
	flex: 1;
}
.inputBox {
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-bottom: 20px;
	position: relative;
}
.inputBox > img {
	height: 40px;
	margin-right: 10px;
}
.inputBox > .err {
	position: absolute;
	left: 65px;
	bottom: -14px;
	color: red;
	font-size: 14px;
}
.top {
	width: 100%;
	border-bottom: 1px solid #ccc;
	margin-bottom: 40px;
	padding: 20px 0;
}
</style>