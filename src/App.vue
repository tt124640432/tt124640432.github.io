<template>
	<div id="app">
		<router-view />
	</div>
</template>

<style>
#app {
	font-family: "Avenir", Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}

::-webkit-scrollbar {
	width: 6px;
	height: 6px;
}
::-webkit-scrollbar-thumb {
	border-radius: 3px;
	background-color: #c3c3c3;
}
::-webkit-scrollbar-track {
	background-color: transparent;
}
::-webkit-scrollbar-track:hover {
	background-color: #e3e3e3;
	/* background-color: transparent; */
}

a {
	text-decoration: none;
}
/*正常的未被访问过的链接*/
a:link {
	text-decoration: none;
}
/*已经访问过的链接*/
a:visited {
	text-decoration: none;
}
/*鼠标划过(停留)的链接*/
a:hover {
	text-decoration: none;
}
/* 正在点击的链接*/
a:active {
	text-decoration: none;
}

pre {
	margin: 0;
	font-family: inherit;
	font-size: 14px;
	white-space: pre-wrap;
	word-break: normal;
	line-height: 1.6;
}

.btn {
	color: #cacaca;
	border-radius: 5px;
	background-image: linear-gradient(#9e9e9e, #1e1e1e);
}

.boxBorder {
	border-radius: 10px;
	border: #cbcdcd solid 1px;
}

.pointer {
	cursor: pointer;
}

textarea,
input {
	border: 1px solid #cacaca;
	border-radius: 5px;
	text-indent: 0.5em;
	outline: none;
}

textarea:focus,
input:focus {
	border: 1px solid #9e9e9e;
	border-radius: 5px;
	text-indent: 0.5em;
}

.center {
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
}
</style>
