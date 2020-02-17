<template>
	<div class="infoBox boxBorder">
		<div class="userInfo">
			<div class="userAvatar">
				<img :src="userInfo.avatar" alt="avater" />
				<img :src="userInfo.avatar" alt="avater" />
			</div>
		</div>
		<div class="setInfo">
			<div class="inputBox">
				<label>昵称</label>
				<input type="text" :placeholder="userInfo.nickname" v-model="nickname" />
			</div>
			<div class="inputBox">
				<label>手机</label>
				<input type="text" :placeholder="userInfo.cellphone" v-model="cellphone" />
				<span class="err" v-show="errMsg">{{errMsg}}</span>
			</div>
			<PicUpLoad :setImg="setImg" />
		</div>
		<div class="bottom">
			<div class="sendBtn btn pointer" @click="setInfo(false)">取消</div>
			<div class="sendBtn btn pointer" @click="setUser">保存</div>
		</div>
	</div>
</template>
<script>
import { setuserApi } from "../http/index";
import PicUpLoad from "../components/PicUpLoad";
export default {
	props: ["userInfo", "setInfo"],
	data() {
		return {
			nickname: "",
			cellphone: "",
			avatar: "",
			errMsg: ""
		};
	},
	components: { PicUpLoad },
	methods: {
		//设置头像
		setImg(result, fileType) {
			this.avatar = result;
		},
		phoneChecking(value) {
			if (/\D/.test(value)) {
				this.errMsg = "请输入数字";
				return false;
			}
			if (value.length !== 11) {
				this.errMsg = "手机号格式有问题";
				return false;
			}
			return true;
		},
		setUser() {
			let obj = {};
			for (let x in this.userInfo) {
				obj[x] = this[x] ? this[x] : this.userInfo[x];
			}
			obj.id = this.$store.state.id;
			if (this.phoneChecking(obj.cellphone)) {
				setuserApi(obj).then(res => {
					console.log(res);
					if (!res.status || res.msg !== "0000") {
						this.$root.toast("保存出现问题");
						return;
					}
					this.$root.toast("保存成功");

					this.setInfo(false);
				});
			}
		}
	}
};
</script>
<style scoped>
.infoBox {
	width: 960px;
	height: 600px;
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	padding: 0 20px;
	z-index: 10;
	background: #f5f6f8;
}
.setInfo {
	text-align: left;
}
/* 输入框 */
.inputBox {
	height: 30px;
	position: relative;
}
.inputBox > label {
	margin-right: 10px;
}
.inputBox > input {
	height: 100%;
}
.inputBox > .err {
	position: absolute;
	left: 55px;
	bottom: -16px;
	color: red;
}
/* 底部按钮 */
.bottom {
	position: absolute;
	bottom: 50px;
	left: 0;
	right: 0;
}
.bottom div {
	display: inline-block;
	margin: 0 20px;
}
.sendBtn {
	padding: 0 40px;
	line-height: 40px;
}
</style>