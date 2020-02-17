# rp

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

发送文字消息,没有返回广播
语音没有时长
语音判断成功的loadding,用不用也加载文字上面
用户头像返回base64
输入框检验
语音播放图标,没有动图

取消录音按钮
如果没有昵称就截取ID的头10个字符吧  done
聊天内容顶部留白    done

1. 与系统的交互提醒要实现，采用toast方式    ✓
2. 取消录音功能 ✓
3. 如果昵称为空，就截取ID的头10个字符   ✓
4. 设置昵称得时候不即时生效     ?存疑?
5. 聊天记录窗口的padding增大，要留白    ✓
6. 
7. 设置页面头像没有正确显示【是否是base64导致的？】     
8. 设置页面要回显       00点12分这里上传图片后,ws并没有及时返回图片
9. 上传的图像有拉伸，定宽不定高就行     头像会变成椭圆形
10. 
11. 小课回复微博的链接的时候，要新tab页打开，不要在当前页面打开  ✓
12. 喇叭的动图要换，成透明的【马提供图片】  ✓
13. 发送语音给小课时，小课也要语音的方式进行回复    ✓
14. vue端部署在github io上
15. 在设置旁边增加退出，退出后返回到首页登录页  ✓

机器人回复无时长