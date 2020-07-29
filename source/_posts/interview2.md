---
title: 前端面试题总结——牛客网
tags: [js, 基础, 面试]
categories: [面试, 题库]
index_img: /img/interview-title.png
banner_img: /img/interview.jpg
date: 2020-07-24 13:48:00
---
# 百度提前批面试一面
## 如何清除浮动
[链接](https://blog.csdn.net/xiaxiaoxian/article/details/85712035)

给浮动元素的父元素添加高度

clear:both;

伪元素清除浮动

给父元素使用overflow:hidden;

br标签清浮动

## px、em、rem说一下？

em：相对于父级的字体大小

rem: 相对于根节点的字体大小

浏览器默认字体大小16px

## 如何实现一个元素水平、垂直居中

position 然后改margin

position 然后`transform:translate(-50%,-50%);`

position 上下左右定位0，然后`margin:auto;`

flex

单行文字：height撑满text-align:center;

## CSS选择第一个元素、最后一个元素、3的整数倍子元素
伪类选择器[链接](https://www.cnblogs.com/yanggeng/p/11188285.html)

|   n   | 2n+1  | 4n+1  | 4n+4  |  4n   | 5n-2  | -n+3  |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
|   0   |   1   |   1   |   4   |   -   |   -   |   3   |
|   1   |   3   |   5   |   8   |   4   |   3   |   2   |
|   2   |   5   |   9   |  12   |   8   |   8   |   1   |
|   3   |   7   |  13   |  16   |  12   |  13   |   -   |
|   4   |   9   |  17   |  20   |  16   |  18   |   -   |
|   5   |  11   |  21   |  24   |  20   |  23   |   -   |

## 说一下伪类和伪元素的区别
[链接](https://blog.csdn.net/guangtouhan/article/details/88074008?utm_medium=distribute.pc_relevant_t0.none-task-blog-BlogCommendFromMachineLearnPai2-1.nonecase&depth_1-utm_source=distribute.pc_relevant_t0.none-task-blog-BlogCommendFromMachineLearnPai2-1.nonecase)

[官方文档](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/Building_blocks/Selectors/Pseudo-classes_and_pseudo-elements)

“伪元素”和“伪类”都带一个“伪”字，那是他们的共同点，所以，他们的区别就是一个本质上是元素，另一个本质上是类。

有没有创建一个文档树之外的元素

① 伪类是以1个冒号(:)作为前缀被添加到选择器末尾的关键字；伪元素是以2个冒号(::)作为前缀被添加到选择器末尾的关键字

② 如果伪类你用了2个冒号，不会报错，但也不会生效，比如 ::hover；但伪元素你用1个或2个冒号不会报错且有效，比如，:before，::before

## 说一下原型和原型链
[链接](https://www.cnblogs.com/Joe-and-Joan/p/10692844.html)

![](/img/interview2-proto.png)

## 说一下闭包以及应用场景
[链接](https://www.cnblogs.com/star-studio/archive/2011/06/22/2086493.html)

## 说一下防抖和节流

防抖：就是将一段时间内连续的多次触发转化为一次触发

节流：减少一段时间内触发的频率

[链接](https://blog.csdn.net/muge1161105403/article/details/106649675/)

## 说一下事件循环
[链接](https://www.cnblogs.com/dong-xu/p/7000163.html)

[链接](https://blog.csdn.net/LuckyWinty/article/details/104765786/)

## TCP和UDP的区别?
[链接](https://blog.csdn.net/qq_34624951/article/details/82669444)

### 为什么说UDP是不可靠的？ 
### 说一下TCP报文头部的结构

## 说一下Promise的优缺点？
**优点**：解决回调地狱

**缺点：**

Promise无法取消，一旦新建就会立即执行

不设置回调函数，Promise内部抛出的错误无法反应到外部

当处于pending状态时，无法得知目前处于哪一阶段（刚刚开始还是即将完成） 

## 简单实现一下Promise
[链接](https://www.jianshu.com/p/51c65b314704)

## JS快速排序
[链接](http://www.ruanyifeng.com/blog/2011/04/quicksort_in_javascript.html)