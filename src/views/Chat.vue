<style>
/* transition */
.fade-enter-active,
.fade-leave-active {
	transition: all 0.5s ease;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
	opacity: 0;
}

.warpBox {
	width: 1000px;
	height: 600px;
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	display: flex;
}
.left {
	width: 700px;
	background: white;
	display: flex;
	flex-direction: column;
	overflow: hidden;
}

/* 输入框 */
.inputBoxBg {
	background: #f5f6f8;
}
.inputBox {
	min-height: 30px;
	display: flex;
	padding: 5px 10px;
	align-items: center;
	position: relative;
}
.voice {
	height: 40px;
	width: 40px;
}
.voice > img {
	width: 100%;
}
.input {
	flex: 1;
	margin: 0 5px;
	resize: none;
	font-size: 16px;
}
.sendBtn {
	padding: 0 40px;
	line-height: 40px;
}
.right {
	width: 300px;
	background: #f5f6f8;
}
/* 用户信息 */
.userInfo {
	height: 120px;
	border-bottom: 1px solid #ccc;
	margin: 0 0 20px;
	display: flex;
	padding-top: 10px;
}
/* 用户头像 */
.userAvatar {
	display: flex;
	flex-direction: column;
	width: 80px;
	height: 100px;
	overflow: hidden;
	margin: 0 20px 0 10px;
	position: relative;
}
.userAvatar:after {
	content: "";
	display: block;
	position: absolute;
	width: 80px;
	height: 20px;
	top: 80px;
	background-image: linear-gradient(
		180deg,
		rgba(255, 255, 255, 0.05) 0%,
		#f5f6f8 100%
	);
}
.userAvatar > img {
	width: 80px;
	border-radius: 50%;
	margin-bottom: 2px;
	transform: rotate(180deg);
}
.userAvatar > img:first-child {
	transform: rotate(0deg);
}
/* 用户昵称与设置 */
.userName {
	height: 80px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	text-align: left;
}
.userName > span {
	font-size: 20px;
	line-height: 36px;
}
.userName > div {
	font-size: 18px;
	display: flex;
	align-items: center;
}
.userName img {
	height: 18px;
	margin-right: 5px;
}
.userButton > div {
	display: flex;
	align-items: center;
	margin-right: 10px;
}
/* 用户列表 */
.user {
	display: flex;
	height: 40px;
	align-items: center;
	padding: 0 10px;
}
.user > img {
	/* height: 40px; */
	width: 40px;
	border-radius: 50%;
}
.user > span {
	margin-left: 10px;
}
/* 聊天区域 */
.chats {
	flex: 1;
	overflow-y: auto;
	padding: 10px 20px 0;
}
</style>
<template>
	<div>
		<!-- <Chat /> -->
		<div class="warpBox">
			<div class="left boxBorder">
				<!-- 聊天内容区域 -->
				<div class="chats" ref="chats">
					<ChatMessage :messageList="messageList" :sendIndex="sendIndex" :userInfo="userInfo" />
				</div>
				<div class="inputBox inputBoxBg" id="inputBox">
					<div class="voice pointer" @click="()=>{showRecorder=true}">
						<img :src="require('../assets/images/voice.png')" alt="voice" />
					</div>
					<textarea class="input" v-model="content" />
					<div class="sendBtn btn pointer" @click="sendChat('text')">发送</div>
					<template v-if="showRecorder">
						<Recorder :sendRec="sendRec" :hiddenRecorder="hiddenRecorder" />
					</template>
				</div>
			</div>
			<div class="right boxBorder">
				<div class="userInfo">
					<div class="userAvatar">
						<img :src="userInfo.avatar" alt="avater" />
						<img :src="userInfo.avatar" alt="avater" />
					</div>
					<div class="userName">
						<span>{{userInfo.nickname || userId.substring(0,9)}}</span>
						<div class="userButton">
							<div class="pointer" @click="setInfo(true)">
								<img :src="require('../assets/images/setter.png')" alt="avater" />
								设置
							</div>
							<div class="pointer" @click="exit">
								<img :src="require('../assets/images/exit.png')" alt="avater" />
								退出
							</div>
						</div>
					</div>
				</div>
				<div class="user" v-for="item of this.userList" :key="item.id">
					<img :src="item.avatar" alt="avater" />
					<span>{{item.nickname || item.id.substring(0,9)}}</span>
				</div>
			</div>
		</div>
		<transition name="fade">
			<Info v-if="showInfo" :userList="userList" :setInfo="setInfo" :userInfo="userInfo" />
		</transition>
	</div>
</template>
<script>
import Recorder from "../components/recorder";
import Info from "../components/Info";
import ChatMessage from "../components/ChatMessage";
import { recordsApi, exitApi } from "../http/index";
import WebsocketClass from "../assets/utils/websocket";
import { mapState } from "vuex";
export default {
	components: { Recorder, Info, ChatMessage },
	data() {
		return {
			content: "", //聊天内容
			websocket: new WebsocketClass({
				wsMsg: this.wsMsg,
				id: this.$store.state.id
			}),
			userList: [], //用户列表
			userId: this.$store.state.id, //用户id
			showInfo: false, //是否显示用户设置
			showRecorder: false, //显示录音按钮
			messageList: [], //聊天内容
			interval: null, //获取用户列表定时器
			// userInfo: this.$store.state.userInfo,
			sendIndex: null //当前发送信息的下边
		};
	},
	mounted() {
		recordsApi().then(this.renderContent);
		this.websocket.initWebSocket();
		//定时请求用户列表
		this.interval = setInterval(() => {
			this.getUserList(this.getUserList);
		}, 1000);
		//清除定时器
		this.$once("hook:beforeDestroy", () => {
			clearTimeout(this.interval);
			this.interval = null;
		});
		// console.log("this.", this.$root.toast);
		// //检测刷新与离开页面
		// window.onbeforeunload = function(e) {
		// 	e = e || window.event;
		// 	// console.log("onbeforeunload", e);
		// 	if (e) {
		// 		e.returnValue = "关闭浏览器聊天内容将会丢失。";
		// 	}
		//这里可以写exit
		// 	return "关闭浏览器聊天内容将会丢失!";
		// };
	},
	computed: {
		...mapState({
			userInfo: "userInfo"
		})
	},
	methods: {
		//初始滚动到底部
		scrollIntoView(index) {
			if (index > 0) {
				this.$nextTick(() => {
					document
						.getElementById("message" + (index || this.sendIndex))
						.scrollIntoView();
				});
			}
		},
		//ws接受消息的处理方法
		wsMsg(data) {
			console.log("wsMsg-----------------------\n", data);
			//用户列表
			if (data.type === "userlist") {
				this.userList = data.obj;
				let [userInfo] = this.userList.filter(obj => {
					return obj.id === this.userId;
				});
				this.$store.dispatch("setUserInfo", userInfo);
				return;
			}
			// if (data.contentType === "mp3") {
			console.log("信息进入", data);
			if (data.obj.id === this.userId) {
				this.messageList[this.sendIndex] = data;
				this.sendIndex = null;
				console.log("this.messageList", this.messageList);
			} else {
				this.messageList.push(data);
			}
			// }
		},
		//用户设置
		setInfo(bool) {
			//这里可以额外添加一次获取用户列表
			this.showInfo = bool;
		},
		//渲染聊天内容
		renderContent(data) {
			console.log("renderContent", data.obj);
			if (data.obj) this.messageList = data.obj;
			this.scrollIntoView(this.messageList.length - 1);
		},
		//ws发送消息的方法
		sendChat(contentType, content, option = {}) {
			let obj = {
				id: this.userId,
				type: "chat",
				contentType: contentType,
				content: content || this.content
			};
			let sendObj = Object.assign(obj, option);
			console.log("sendObj", JSON.stringify(sendObj));
			this.mockWsData(sendObj, contentType);
			this.websocket.websocketsend(JSON.stringify(sendObj));
			this.scrollIntoView();
			this.content = "";
		},
		//模拟ws返回数据->用于先展示数据使用
		mockWsData(sendObj, contentType) {
			this.sendIndex = this.messageList.length;
			let text = {
				type: "chat",
				msg: "",
				obj: {
					id: this.userId,
					avatar: this.userInfo.avatar,
					msg: sendObj.content
				}
			};
			let voice = {
				status: true,
				type: "chat",
				msg: "",
				obj: {
					id: this.userId,
					avatar: this.userInfo.avatar,
					msg: "",
					fileName: "loading",
					mp3: "loading",
					timeLength: sendObj.timeLength,
					size: sendObj.size
				}
			};
			this.messageList.push(contentType === "text" ? text : voice);
		},
		//获取用户列表
		getUserList(fn) {
			let obj = {
				id: this.userId,
				type: "userlist",
				contentType: "nil",
				content: "nil"
			};
			this.websocket.websocketsend(JSON.stringify(obj));
		},
		//隐藏录音
		hiddenRecorder() {
			this.showRecorder = false;
		},
		sendRec(readerData, timeLength) {
			let content = readerData.substr(readerData.indexOf(",") + 1);
			let option = {
				timeLength: Math.ceil(timeLength / 1000),
				size: content.length
			};
			this.hiddenRecorder();
			this.sendChat("mp3", content, option);
			console.log("readerData", readerData);
		},
		//退出登录
		exit() {
			exitApi().then(res => {
				if (!res.status || res.msg !== "0000") {
					this.$root.toast("退出出现问题");
					return;
				}
				this.$root.toast("退出成功");
				this.$router.push("/login");
			});
		}
	}
};
</script>
