---
title: Vue-router学习笔记
tags: [vue, router]
categories: [框架, vue, router]
index_img: /img/ts.jpg
banner_img: /img/ts.jpg
date: 2020-08-11 14:17:00
---
# 原理 
vue-router通过hash与History interface两种方式实现前端路由，更新视图但不重新请求页面”是前端路由原理的核心之一，目前在浏览器环境中这一功能的实现主要有两种方式
* hash 利用url里边的`#`
* `history interface` 在HTML5中新增的方法

> 默认是 `hash` ,浏览器如果不支持就是`history interface`

# 源码
```js
// 根据mode确定history实际的类并实例化
switch (mode) {
  case 'history':
    this.history = new HTML5History(this, options.base)
    break
  case 'hash':
    this.history = new HashHistory(this, options.base, this.fallback)
    break
  case 'abstract':
    this.history = new AbstractHistory(this, options.base)
    break
  default:
    if (process.env.NODE_ENV !== 'production') {
      assert(false, `invalid mode: ${mode}`)
    }
}
```

# 两种模式的介绍
## mode:'hash'，多了 “ # ”
```
http://localhost:8080/#/recommend
```

### HashHistory.push()
从设置到路由改变的过程`$router.push() --> HashHistory.push() --> History.transitionTo() --> History.updateRoute() --> {app._route = route} --> vm.render()`

```js
$router.push() //调用方法

HashHistory.push() //根据hash模式调用,设置hash并添加到浏览器历史记录（添加到栈顶）（window.location.hash= XXX）

History.transitionTo() //监测更新，更新则调用History.updateRoute()

History.updateRoute() //更新路由

{app._route= route} //替换当前app路由

vm.render() //更新视图
```

> 看上去就是手动更新，控制路由变化

### HashHistory.replace()
源码
```ts
replace (location: RawLocation, onComplete?: Function, onAbort?: Function) {
  this.transitionTo(location, route => {
    replaceHash(route.fullPath)
    onComplete && onComplete(route)
  }, onAbort)
}

// 截取路由#之前的内容然后将新路由加在后边进行跳转
function replaceHash (path) {
  const i = window.location.href.indexOf('#')
  window.location.replace(
    window.location.href.slice(0, i >= 0 ? i : 0) + '#' + path
  )
}
```


## mode:'history'
```
http://localhost:8080/recommend
```

History interface是浏览器历史记录栈提供的接口，通过back(), forward(), go()等方法，我们可以**读取浏览器历史记录栈的信息**，进行各种跳转操作。

从HTML5开始，History interface有进一步修炼：pushState(), replaceState() 这下不仅是读取了，还可以**对浏览器历史记录栈进行修改**：
```js
window.history.pushState(stateObject, title, URL)
window.history.replaceState(stateObject, title, URL)

// stateObject: 当浏览器跳转到新的状态时，将触发popState事件，该事件将携带这个stateObject参数的副本

// title: 所添加记录的标题

// URL: 所添加记录的URL
```

## 区别
pushState设置的新URL可以是与当前URL同源的任意URL；而hash只可修改#后面的部分，故只可设置与当前同文档的URL

pushState通过stateObject可以添加任意类型的数据到记录中；而hash只可添加短字符串

pushState可额外设置title属性供后续使用

history模式则会将URL修改得就和正常请求后端的URL一样,如后端没有配置对应/user/id的路由处理，则会返回404错误

相关链接：[彻底搞懂路由跳转](https://segmentfault.com/a/1190000014120456?utm_source=tag-newest)