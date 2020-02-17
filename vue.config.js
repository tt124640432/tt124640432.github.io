module.exports = {
	lintOnSave: false,
	devServer: {
		proxy: {
			"/apis": {
				target: "http://106.12.183.175:89/",
				pathRewrite: {
					"^/apis": ""
				},
				changeOrigin: true
			},
			"/public": {
				target: "http://106.12.183.175:89/"
			}
		}
	}
};
