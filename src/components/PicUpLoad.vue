<template>
	<div>
		<div class="show" v-if="!headerImage">
			<div class="upLoadBox">
				<div class="btn">
					<img :src="require('../assets/images/upLoad.png')" alt="upLoad" />
					<span>上传附件</span>
					<input type="file" id="upload1" accept="image" @change="upload" alt title />
				</div>
				<div>
					<span>{{msg}}</span>
				</div>
			</div>
		</div>
		<div v-else>
			<div>
				<div class="userAvatar upLoadBox">
					<img :src="headerImage" alt="userAvatar" />
				</div>
				<div class="btn delete" @click="delImg()">
					<img :src="require('../assets/images/delete.png')" alt="delete" />
					删除
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	props: ["setImg"],
	data() {
		return {
			msg: "上传的图片大小不能超过5M",
			headerImage: "", //显示用的图片
			picValue: "" //图片信息
		};
	},
	methods: {
		// 删除文件
		delImg() {
			this.headerImage = "";
		},
		upload(e) {
			let files = e.target.files || e.dataTransfer.files;
			if (!files.length) return;
			this.picValue = files[0];
			this.imgPreview(this.picValue);
		},
		imgPreview(file) {
			let self = this;
			// 看支持不支持FileReader
			if (!file || !window.FileReader) return;
			let FILE_MAX = 5 * 1024 * 1024;
			if (file.size > FILE_MAX) {
				//提示
				return;
			}
			if (/^image/.test(file.type)) {
				let reader = new FileReader();
				// 将图片将转成 base64 格式
				reader.readAsDataURL(file);
				//           读取文件成功后的回调
				reader.onloadend = function() {
					let result = this.result;
					// let newres = result.substr(result.indexOf(",") + 1); // 截取base64字符串部分
					// self.setImg(newres, file.type);
					self.setImg(result, file.type);
					self.headerImage = this.result;
				};
			}
		}
	}
};
</script>
<style scoped>
.show {
	width: auto;
	height: auto;
	border-radius: 5px;
}

/* 上传图片的上下距离 */
.upLoadBox{
	padding: 20px 0 10px;

}
.userAvatar {
	height: 80px;
}
.userAvatar:after {
	display: none;
}

.btn {
	background: #fff;
	border: 1px solid #bfcbd9;
	color: #1f2d3d;
	border-radius: 4px;
	text-align: center;
	width: 110px;
	cursor: pointer;
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
}

.btn:hover {
	background: #fff;
	border-color: #50bfff;
	color: #50bfff;
}

/* 这里是图像投影,可用作变换图片颜色 */
.btn:hover > img {
	filter: drop-shadow(0 0);
	border-left: 0 solid transparent;
}

.btn > img {
	height: 40px;
}

.delete > img {
	height: 30px;
	padding: 5px 0;
	margin-right: 10px;
}

.delete:hover {
	background: #fff;
	border-color: red;
	color: red;
}
#upload1 {
	position: absolute;
	font-size: 0;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	opacity: 0;
	width: 100%;
	cursor: pointer;
	border: none;
}
</style>
