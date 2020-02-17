<script>
export default {
	props: ["messageList", "sendIndex", "userInfo"],
	data() {
		return {
			showTranslate: -1, //显示翻译
			createAudio: false, //创建audio
			playVioce: -1
		};
	},
	components: {
		Card: {
			props: ["item"],
			render: function(createElement) {
				let weibo = JSON.parse(this.item);
				return createElement(
					"a",
					{ attrs: { href: weibo.link, class: "card", target: "_blank" } },
					[
						createElement("h3", weibo.title),
						createElement("div", {}, [
							createElement("span", `来自@ ${weibo.from} 的微博文章`),
							createElement("img", { attrs: { src: weibo.img } })
						]),
						createElement("span", weibo.foot)
					]
				);
			}
		}
	},
	methods: {
		voicePlay(item, index) {
			if (this.sendIndex === index) return;
			let voiceMsgPlayer = this.$refs.voiceMsgPlayer;
			if (this.createAudio) {
				setTimeout(() => {
					voiceMsgPlayer.pause();
					voiceMsgPlayer.src = "empty";
					this.createAudio = false;
				}, 500);
				this.playVioce = -1;
			} else {
				voiceMsgPlayer.src = item.obj.mp3;
				voiceMsgPlayer.play();
				this.createAudio = true;
				this.playVioce = index;
			}
			voiceMsgPlayer.onended = () => {
				voiceMsgPlayer.src = "empty";
				this.createAudio = false;
				this.playVioce = -1;
			};
		},
		translateVoice(item, index) {
			console.log("index", index);
			if (this.sendIndex !== index) {
				this.showTranslate = index;
			}
		}
	}
};
</script>
<template>
	<div>
		<div
			class="message"
			:class="item.obj.id===$store.state.id?'me':''"
			v-for="(item,index) of messageList"
			:key="index+''"
			:id="'message'+index"
		>
			<img
				class="avatar"
				:src="item.obj.id===$store.state.id?userInfo.avatar:item.obj.avatar"
				alt="avater"
			/>
			<div class="content">
				<div
					class="bubble"
					:class="item.obj.id===$store.state.id?'bubble_primary bubble_right':'bubble_default bubble_left'"
				>
					<!-- weibo -->
					<div class="bubble_cont" v-if="item.obj.weibo">
						<Card :item="item.obj.msg" />
					</div>
					<!-- 语音 -->
					<div class="bubble_cont" v-else-if="item.obj.fileName || item.obj.mp3">
						<div
							class="voice"
							@click="voicePlay(item,index)"
							@dblclick="translateVoice(item,index)"
							:style="{width:`${500/60*item.obj.timeLength}px`,minWidth:'60px',maxWidth:'500px'}"
						>
							<template v-if="item.obj.id!==$store.state.id">
								<img
									v-if="index !== playVioce"
									:src="require('../assets/images/chat.png')"
									alt="左侧"
									class="reverseImg"
								/>
								<img
									v-if="index === playVioce"
									:src="require('../assets/images/chat.gif')"
									alt="左侧"
									class="reverseImg"
								/>
							</template>
							<span class="duration">{{item.obj.timeLength}}''</span>
							<template v-if="item.obj.id===$store.state.id">
								<img v-if="index !== playVioce" :src="require('../assets/images/chat.png')" alt="右侧" />
								<img v-if="index === playVioce" :src="require('../assets/images/chat.gif')" alt="右侧" />
							</template>
						</div>
						<img
							v-show="sendIndex === index"
							class="ico_loading"
							:src="require('../assets/images/loadding.gif')"
							alt="loadding"
						/>
					</div>
					<!-- 文字 -->
					<div class="bubble_cont" v-else>
						<div class="plain">
							<pre class>{{item.obj.msg}}</pre>
							<img
								v-show="sendIndex === index"
								class="ico_loading"
								:src="require('../assets/images/loadding.gif')"
								alt="loadding"
							/>
							<!-- <i
												class="ico_fail web_wechat_message_fail ng-hide"
												@click="resendMsg(message)"
												v-show="message.MMStatus == 5"
												title="重新发送"
							></i>-->
						</div>
					</div>
				</div>
			</div>
			<div class="translateVoice" v-if="index === showTranslate" @click="showTranslate = -1">
				<pre>{{item.msg.say || item.msg}}</pre>
				<div class="translateDone">
					<img :src="require('../assets/images/translateDone.png')" alt="translateDone" />
					<sub>转换完成</sub>
				</div>
			</div>
		</div>
		<audio id="voiceMsgPlayer" class="voicePlayer" style="width: 0px; height: 0px;">
			<audio ref="voiceMsgPlayer" preload="metadata"></audio>
		</audio>
	</div>
</template>
	
<style scoped>
.message {
	margin-bottom: 16px;
	float: left;
	width: 100%;
	text-align: left;
}
.message.me {
	float: right;
	text-align: right;
	clear: right;
}
.message.me .avatar {
	float: right;
}
.message .avatar {
	width: 40px;
	height: 40px;
	border-radius: 2px;
	-moz-border-radius: 2px;
	-webkit-border-radius: 2px;
	float: left;
	border-radius: 50%;
}

.bubble,
.translateVoice {
	max-width: 500px;
	min-height: 1em;
	display: inline-block;
	vertical-align: top;
	position: relative;
	text-align: left;
	font-size: 14px;
	border-radius: 3px;
	margin: 0 10px;
}
.bubble.bubble_primary {
	background-color: #7ed251;
	border: 1px solid #7ed251;
}
.bubble_cont {
	word-wrap: break-word;
	word-break: break-all;
	min-height: 25px;
}
.bubble_cont .plain {
	padding: 9px 13px;
}
.ico_loading {
	position: absolute;
	right: 100%;
	top: 50%;
	margin-top: -7px;
	margin-right: 13px;
}
.bubble_cont img {
	vertical-align: middle;
}
.bubble.bubble_default {
	background-color: #f8f9fb;
	border: 1px solid #ececed;
}

.bubble:after,
.bubble:before {
	position: absolute;
	top: 14px;
	border: 1px solid transparent;
	content: " ";
	width: 7px;
	height: 7px;
	display: block;
}

.bubble.bubble_left:after,
.bubble.bubble_left:before {
	left: -5px;
}

.bubble.bubble_left:after {
	z-index: 10;
	background-color: #f8f9fb;
	border-top-color: #ececed;
	border-left-color: #ececed;
	transform: rotate(-45deg);
}

.bubble.bubble_right:after,
.bubble.bubble_right:before {
	right: -5px;
}

.bubble.bubble_primary.bubble_right:after {
	z-index: 10;
	background-color: #7ed251;
	border-top-color: #7ed251;
	border-right-color: #7ed251;
	transform: rotate(45deg);
}
.reverseImg {
	transform: rotate(180deg);
}
.duration {
	line-height: 40px;
}

.me .voice {
	text-align: end;
}

.voice {
	text-align: start;
}

.voice > img {
	height: 30px;
	width: 30px;
	margin: 0 6px;
}

.voice,
.translateVoice {
	user-select: none;
}
.translateVoice {
	/* max-width: 400px; */
	padding: 5px;
	margin: 0 50px;
	border: 1px solid #edeef0;
	background: #f8f9fb;
}

.translateDone {
	font-size: 14px;
	color: #cdcdcd;
	display: flex;
	align-items: center;
	margin-top: 5px;
}
.translateDone > img {
	height: 12px;
	margin-right: 5px;
}

.card {
	width: 250px;
	height: 100px;
	padding: 5px 10px;
	color: #2c3e50;
	display: block;
}

/deep/ .card * {
	margin: 0;
}

/deep/ .card > div,
/deep/ .card > span {
	font-size: 14px;
	color: #ced0d0;
	line-height: 28px;
}

/deep/ .card > div {
	display: flex;
	justify-content: space-between;
	height: 50px;
	padding: 5px 0;
	border-bottom: 1px solid #ced0d0;
}
/deep/ .card > div > img {
	height: 45px;
}
</style>