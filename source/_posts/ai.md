---
title: 小爱课程表代码学习
tags: [js, 小爱]
categories: [源码, 小爱]
index_img: /img/algo-title.png
banner_img: /img/logic.jpg
date: 2020-08-24 10:00:00
---

# 课程表代码
## components
### ai-reply
#### 功能：未知
#### 依赖：无
#### 知识点：
dppx：每像素包含点的数量（dots per pixel）这里使用2和3适配高分屏[链接](https://www.html.cn/book/css/values/resolution/dppx.htm)

clip-path：对元素进行裁剪[链接](https://developer.mozilla.org/zh-CN/docs/Web/CSS/clip-path)

### ai-task
#### 功能：未知
#### 依赖：
util/xiaoai
#### 知识点：
useRef(): 可以跨生命周期保存数据，和useState的不同就是，里边数据更新不会导致页面渲染[链接](https://blog.csdn.net/hjc256/article/details/102587037)

classList: 操作元素的类列表add, remove, contains, item, toggle[链接](https://www.runoob.com/jsref/prop-element-classlist.html)

dom-helpers：操作元素快捷封装[链接](https://github.com/react-bootstrap/dom-helpers)

### bottom-tab
#### 功能：底部状态栏
#### 依赖：无
#### 知识点：
监听当前路由进行变化，相较于我使用全局state控制更加智能

window.addEventListener('hashchange',() => {})

### button
#### 功能：按钮插件
#### 依赖：
util/screen
#### 知识点：
防抖：第一次触发事件后不执行，等一段时间没再触发就执行，本质上只执行一段时间内最后一次触发(时间是根据触发间隔)[链接](https://www.jianshu.com/p/c8b86b09daf0)

节流：第一次触发之后就执行，然后忽略后续触发直至倒计时结束，本质上只执行一段时间内第一次触发(时间是根据设置的时间)[链接](https://segmentfault.com/a/1190000018428170)

### check-radio
#### 功能：单选按钮
#### 依赖：无
#### 知识点：
点击之后执行父组件传来的事件函数，点击判定状态由组件自己维护

疑问：如果传入的事件函数是setState，会不会先重绘子组件再重绘父组件导致再重绘子组件

### course-style-picker
#### 功能：课程颜色选择
#### 依赖：无
#### 知识点：
对数组进行`.map()`来实现列表渲染，放在{}里，然后将元素return

对于需要列表渲染的子元素最好封装成组件

### dialog
#### 功能：实现dialog弹窗
#### 依赖：无
#### 知识点：
createPortal可以将新创建的组件放在任何一个元素里[链接](http://www.ptbird.cn/react-portal-createPortal.html)

用了一个动画组件库`rc-animate`[链接](https://www.jianshu.com/p/8638430fb611)

### drag
#### 功能：对元素触摸事件封装
#### 依赖：
/util/dom
#### 知识点
cloneElement克隆组件可以修改元素的属性[链接](https://www.jianshu.com/p/c8a1c0d3696d)

### foot-goto
#### 功能：从小爱查询今日课程底部跳转课程表链接
#### 依赖：无
#### 知识点：
Link preact-router组件的路由跳转，路由写在href属性中，和a标签差不多

### guide
#### 功能：定位组件，给新手引导进行定位
#### 依赖：
util/report

srv/bus
#### 知识点：
ele.getBoundingClientRect：获取该元素相对于浏览器可视范围的距离，返回{top,left,bottom,right,width,height}[链接](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/getBoundingClientRect)

visibilitychange：监听页面可见性[链接](https://www.jianshu.com/p/e905584f8ed2)

### input
#### 功能：输入框组件
#### 依赖：无
#### 知识点：
oncompositionstart：输入中文开始(文本框内是拼音)

oncompositionend：输入中文结束(拼音合成为文字)
[链接](https://developer.mozilla.org/zh-CN/docs/Web/Events/compositionstart)

css中的&代表上一级[链接](https://blog.csdn.net/weixin_42861240/article/details/82383709)

### input-pic
#### 功能：点击上传图片按钮
#### 依赖：
util/screen

@mi/folme Mouse
#### 知识点：
@color 在less内是变量[链接](https://less.bootcss.com/)

#### 问题：
返回是Button可能和Button冲突，不过是default，引入的时候改名就行

### li-lesson
#### 功能：

