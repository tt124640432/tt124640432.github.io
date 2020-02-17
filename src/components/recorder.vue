<style scoped>
/* body {
	word-wrap: break-word;
	background: #f5f5f5 center top no-repeat;
	background-size: auto 680px;
}
pre {
	white-space: pre-wrap;
}
a {
	text-decoration: none;
	color: #06c;
}
a:hover {
	color: #f00;
} */

.main {
	/* max-width: 700px; */
	/* padding-bottom: 80px; */
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	padding: 1% 0.5%;
}

/* .mainBox {
	margin-top: 12px;
	padding: 12px;
	border-radius: 6px;
	background: #fff;
	--border: 1px solid #0b1;
	box-shadow: 2px 2px 3px #aaa;
} */

.mainBox {
	position: absolute;
	left: 50%;
	transform: translate(-50%, 0px);
	top: -300px;
	z-index: -1;
}

.showMainBox {
	z-index: 10;
}
.start,
.cancel {
	display: inline-block;
}
.cancel {
	width: 80px;
	margin-right: 30px;
}
.start {
	width: 400px;
}
</style>

<template>
	<div class="main inputBoxBg">
		<slot name="top"></slot>
		<div class="btn sendBtn pointer" @click="recStop" v-if="showRecStop">点击结束录音</div>
		<div class="btn sendBtn pointer cancel" @click="recCancel" v-if="!showRecStop">取消录音</div>
		<div class="btn sendBtn pointer start" @click="recStart" v-if="!showRecStop">点击开始录音</div>
		<!-- <div class="mainBox"> -->
		<!-- <div>
                类型：{{ type }}
                <span style="margin:0 20px">
                    比特率:
                    <input type="text" v-model="bitRate" style="width:60px" /> kbps
                </span>
                采样率:
                <input type="text" v-model="sampleRate" style="width:60px" /> hz
		</div>-->

		<!-- <div>
				<button class="mainBtn ctrlBtn" @click="recOpen">打开录音，请求权限</button>
				<button class="mainBtn ctrlBtn" @click="recStart">开始录音</button>
				<button class="mainBtn ctrlBtn" @click="recStop">结束录音，并释放资源</button>
		</div>-->
		<!-- </div> -->
		<!-- 波形 -->
		<div class="mainBox" :class="showMainBox?'showMainBox':''">
			<div
				style="height:100px;width:300px;border:1px solid #ccc;box-sizing: border-box;display:inline-block;vertical-align:bottom"
				class="ctrlProcessWave"
			></div>
			<!-- <div
				style="height:40px;width:300px;display:inline-block;background:#999;position:relative;vertical-align:bottom"
			>
				<div
					class="ctrlProcessX"
					style="height:40px;background:#0B1;position:absolute;"
					:style="{ width: powerLevel + '%' }"
				></div>
				<div
					class="ctrlProcessT"
					style="padding-left:50px; line-height:40px; position: relative;"
				>{{ duration + "/" + powerLevel }}</div>
			</div>-->
		</div>
		<!-- 录制状态 -->
		<!-- <div class="mainBox">
			<audio ref="LogAudioPlayer" style="width:100%"></audio>

			<div class="mainLog">
				<div v-for="obj in logs" :key="obj.idx">
					<div
						:style="{
              color:
                obj.color == 1 ? 'red' : obj.color == 2 ? 'green' : obj.color
            }"
					>
						<span v-once>[{{ getTime() }}]</span>
						<span v-html="obj.msg" />
					</div>
				</div>
			</div>
		</div>-->

		<div
			v-if="recOpenDialogShow"
			style="z-index:99999;width:100%;height:100%;top:0;left:0;position:fixed;background:rgba(0,0,0,0.3);"
		>
			<div style="display:flex;height:100%;align-items:center;">
				<div style="flex:1;"></div>
				<div style="width:240px;background:#fff;padding:15px 20px;border-radius: 10px;">
					<div style="padding-bottom:10px;">录音功能需要麦克风权限，请允许；如果未看到任何请求，请点击忽略~</div>
					<div style="text-align:center;">
						<a @click="waitDialogClick" style="color:#0B1">忽略</a>
					</div>
				</div>
				<div style="flex:1;"></div>
			</div>
		</div>

		<!-- <slot name="bottom"></slot> -->
	</div>
</template>

<script>
import Recorder from "recorder-core";

export default {
	props: ["sendRec", "hiddenRecorder"],
	data() {
		return {
			type: "mp3",
			bitRate: 16,
			sampleRate: 16000,

			rec: 0,
			duration: 0,
			powerLevel: 0,

			recOpenDialogShow: 0,
			logs: [],

			showRecStop: false, //显示结束录音
			time: null, //计时器
			showMainBox: false,
			startTime: 0 //录音开始时间
		};
	},
	mounted() {
		//开启录音权限
		this.recOpen();
	},
	methods: {
		recOpen: function() {
			var This = this;
			var rec = (this.rec = Recorder({
				type: This.type,
				bitRate: This.bitRate,
				sampleRate: This.sampleRate,

				onProcess: function(buffers, powerLevel, duration, sampleRate) {
					This.duration = duration;
					This.powerLevel = powerLevel;
					// console.log(powerLevel / 10 / 2);

					This.wave.input(buffers[buffers.length - 1], powerLevel, sampleRate);
				}
			}));

			This.dialogInt = setTimeout(function() {
				//定时8秒后打开弹窗，用于监测浏览器没有发起权限请求的情况
				This.showDialog();
			}, 8000);

			rec.open(
				function() {
					This.dialogCancel();
					This.reclog(
						"已打开:" +
							This.type +
							" " +
							This.sampleRate +
							"hz " +
							This.bitRate +
							"kbps",
						2
					);

					This.wave = Recorder.WaveView({ elem: ".ctrlProcessWave" });
				},
				function(msg, isUserNotAllow) {
					This.dialogCancel();
					This.reclog(
						(isUserNotAllow ? "UserNotAllow，" : "") + "打开失败：" + msg,
						1
					);
				}
			);

			This.waitDialogClickFn = function() {
				This.dialogCancel();
				This.reclog("打开失败：权限请求被忽略，用户主动点击的弹窗", 1);
			};
		},

		timeLimit() {
			//显示录音结束按钮
			this.showRecStop = true;
			this.time = setTimeout(() => {
				this.recStop();
			}, 5999); //注意这里事6秒
		},

		recCancel() {
			this.rec.stop(
				() => {},
				() => {},
				true
			);
			this.hiddenRecorder();
		},

		recStart: function() {
			if (!this.rec) {
				this.reclog("未打开录音", 1);
				return;
			}
			this.rec.start();
			this.startTime = +new Date(); //录音开始计时
			this.showMainBox = true; //显示波形
			this.timeLimit(); //开启计时器
			var set = this.rec.set;
			this.reclog(
				"录制中：" +
					set.type +
					" " +
					set.sampleRate +
					"hz " +
					set.bitRate +
					"kbps"
			);
		},

		recStop: function() {
			var This = this;
			var rec = This.rec;
			var reader = new FileReader();
			This.rec = null;
			this.time = null; //清除定时器
			if (!rec) {
				This.reclog("未打开录音", 1);
				return;
			}
			// console.log("asddd", rec); // eslint-disable-line
			rec.stop(
				function(blob) {
					reader.readAsDataURL(blob);
				},
				function(s) {
					This.reclog("结束出错：" + s, 1);
				},
				true
			); //自动close
			reader.onloadend = function() {
				// o.down64Val = reader.result;
				This.sendRec(reader.result, rec.envInLast - rec.envInFirst);
			};
		},

		reclog: function(msg, color, res) {
			this.logs.splice(0, 0, {
				idx: this.logs.length,
				msg: msg,
				color: color,
				res: res,

				playMsg: "",
				down: 0,
				down64Val: ""
			});
		},
		getTime: function() {
			var now = new Date();
			var t =
				("0" + now.getHours()).substr(-2) +
				":" +
				("0" + now.getMinutes()).substr(-2) +
				":" +
				("0" + now.getSeconds()).substr(-2);
			return t;
		},

		showDialog: function() {
			//我们可以选择性的弹一个对话框：为了防止移动端浏览器存在第三种情况：用户忽略，并且（或者国产系统UC系）浏览器没有任何回调
			if (!/mobile/i.test(navigator.userAgent)) {
				return; //只在移动端开启没有权限请求的检测
			}
			this.recOpenDialogShow = 1;
		},
		dialogCancel: function() {
			clearTimeout(this.dialogInt);
			this.recOpenDialogShow = 0;
		},
		waitDialogClick: function() {
			this.dialogCancel();
			this.waitDialogClickFn();
		}
	}
};
</script>
