let wsUrl = "";
let wsURLArr = [
	{
		type: "development",
		url: "ws://106.12.183.175:89"
	},
	{
		type: "production",
		// url: "ws://127.0.0.1:89"
		// url: "ws://106.12.183.175:89"
		url: "ws://" + window.location.hostname + ":89"
	}
];
wsURLArr.forEach(item => {
	if (process.env.NODE_ENV === item.type) {
		wsUrl = item.url;
	}
});
class WebsocketClass {
	constructor(executor) {
		console.log(executor);
		let { wsMsg, id } = executor;
		this.websock = "";
		this.wsMsg = wsMsg;
		this.id = id;
	}
	initWebSocket = () => {
		//初始化weosocket
		// const wsuri = `ws://106.12.183.175:89/chat?id=${this.id}`; //这个地址由后端童鞋提供
		const wsuri = `${wsUrl}/chat?id=${this.id}`; //这个地址由后端童鞋提供
		this.websock = new WebSocket(wsuri);
		this.websock.onmessage = this.websocketonmessage;
		this.websock.onopen = this.websocketonopen;
		this.websock.onerror = this.websocketonerror;
		this.websock.onclose = this.websocketclose;
	};
	websocketonopen = () => {
		//连接建立之后执行send方法发送数据
		// this.websocketsend("test");
		console.log("连接建立");
	};
	websocketonerror = () => {
		//连接建立失败重连
		this.initWebSocket();
	};
	websocketonmessage = e => {
		console.log(e);
		if (e.data) this.wsMsg(JSON.parse(e.data));

		// let _this = this; //数据接收
		// if (e.data == "连接成功") {
		// 	//这个判断是我业务需求才加的
		// 	return;
		// }
		//业务需求，将socket接收到的值存进vuex
		// _this.$store.store.dispatch("RESET_ID"); //先调用reset方法置空vuex > store里面的scorketId（为什么置空，下面标题3解释）
		// _this.$store.store.dispatch("SAVE_ID", JSON.parse(e.data).areaId); //重新给store中的scorketId赋值（数据格式问题先转了json）
		// console.log(_this.$store.store.state.scorketId);
	};
	websocketsend = Data => {
		console.log(Data);
		//数据发送
		this.websock.send(Data);
	};
	websocketclose = e => {
		//关闭
		console.log("断开连接", e);
	};
}
export default WebsocketClass;
