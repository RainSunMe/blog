---
title: 前端基础面试题--灰蓝宇墨
tags: [js, 基础, 面试]
categories: [面试]
index_img: /img/interview-title.png
banner_img: /img/interview.jpg
date: 2020-07-06 18:53:00
---
# JavaScript
写在前面：这是个基础的面试题，而且他的叙述也并不是很详细，建议一边看一边实验一边百度，或许在看这个文章之前你应该看一下[《你不知道的Javascript》](/2020/04/js1)
## 数据类型
基本数据类型：undefined、null、boolean、number、string、symbol

引用数据类型：object、array、function（统称为object）

### 数据类型检测
`typeof`对于基本数据类型来说，除了`null`都可以显示正确的类型，`typeof`对于对象来说，除了函数都会显示`object`
> 注意：`console.log(typeof NaN)   //number`

instanceof通过原型链来判断数据类型的

```js
p1 = new Person()
p1 instanceof Person // true
```

`Object.prototype.toString.call()`可以检测所有的数据类型，算是一个比较完美的方法了

```js
var obj={}
var arr=[]
var num = 1
console.log(Object.prototype.toString.call(obj))    //[object Object]
console.log(Object.prototype.toString.call(arr))    //[object Array]
console.log(Object.prototype.toString.call(num))    //[object Number]
```

### 深浅拷贝

#### 浅拷贝

```js
Object.assign()    //es6的方法
```

Object.assign会合并对象生成一个新对象。如果对象的属性是普通类型改变之后新对象不会改变，如果是引用类型改变后新对象也会改变，所以Object.assign实际上还是浅拷贝。

#### 深拷贝

`JSON.parse(JSON.stringify(obj))`

利用JSON.stringify(obj)将对象先转为json字符串，再JSON.parse(）转回为json对象可以实现深拷贝，这也是比较常用的一种方法

#### 用js实现一个深拷贝
其实深拷贝可以拆分成 2 步，浅拷贝 + 递归，浅拷贝时判断属性值是否是对象，如果是对象就进行递归操作，两个一结合就实现了深拷贝
```js
function cloneDeep(source) {
  if (!isObject(source)) return source; // 非对象返回自身
  var target = Array.isArray(source) ? [] : {};
  for (var key in source) {
    if (source.hasOwnProperty(key)) {
      if (isObject(source[key])) {
        target[key] = cloneDeep(source[key]); // 注意这里
      } else {
        target[key] = source[key];
      }
    }
  }
  return target;
}
function isObject(obj) {
  return typeof obj === 'object' && obj != null;
}
```

## 作用域
### 变量声明提升
在JS中，函数声明`function aa(){}`和变量声明`var`经常被隐式提升到当前作用域的顶部
> let 不会被提升，关于let的问题[链接](https://blog.csdn.net/jolab/article/details/82466362)

函数声明的优先级高于变量，如果变量名跟函数名相同且未赋值，则函数声明会覆盖变量声明

声明语句中的赋值部分并不会被提升，只有变量的名称被提升

### 作用域链
因为函数的嵌套形成作用域的层级关系。当函数执行时，从当前作用域开始搜，没有找到的变量，会向上层作用域查找，直至全局函数，这就是作用域链。

在 JavaScript 中，作用域为 `function(){}`内的区域，称为函数作用域

全局函数无法查看局部函数的内部细节，但局部函数可以查看其上层的函数细节，直至全局细节

### 闭包
闭包的原理就是作用域链，比函数F内部有一个函数G，函数G可以访问到函数F中的变量，那么函数G就是闭包
```js
function F() {
  let a = 1
  window.G = function () {
    console.log(a)
  }
}
F()
G() // 1
```

## 原型和继承
### js创建对象的几种方式
对象字面量`var obj={};`

new一个构造函数
```js
function Pel(){}
  p.name="hu";
  p.age="25";
  p.address=function(){}
}
var p=new Pel();
```

new一个内置对象
```js
var obj=new Object();
```

`Object.create()`创建对象
```js
var test = Object.create({x:1});
```

> 关于以上几种方式创建的对象的区别，详见[链接](https://blog.csdn.net/sinat_27514587/article/details/102964631)

### JS 如何实现一个类

构造函数法

缺点：用到了 this 和 prototype，编写复杂，可读性差
```js
function P(name, age){
  this.name = name;
  this.age= age;
}
P.prototype.sal= function(){}
var pel= new P("jj", 1);
pel.sell()
```

ES6 语法糖 class

```js
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  toString() {
    return '(' + this.x + ', ' + this.y + ')';
  }
}
var point = new Point(2, 3);
```

### 原型链
一句话解析什么是原型链

> 遍历一个实列的属性时，先遍历实列对象上的属性，再遍历它的原型对象，一直遍历到Object

任何一个类（函数）都有原型对象，原型对象至少有两个属性(constructor,proto)。`constructor`指向函数本身，`proto`指向父类原型对象

函数上有一个prototype属性，指向原型对象，通过它可以访问原型对象

函数的实列可以直接访问原型对象(因为实列上有proto指向构造函数的原型对象)

> 彻底弄懂JS原型与继承，详见[链接](https://mp.weixin.qq.com/s?__biz=MzI5MjU0Mjk5MA==&mid=2247483768&idx=1&sn=4579b7bd22420d18009505a5a7454a9d&chksm=ec7e8e19db09070f8d529cb6a3f9bb425c20ac3bd4d936f4eb9e918facbe3d7e6eecdd719c4c&token=816776520&lang=zh_CN#rd)

## new和this

### 使用new的时候发生了什么
首先是创建实例对象{}

this 变量引用该对象，同时还继承了构造函数的原型

其次属性和方法被加入到 this 引用的对象中

并且新创建的对象由 this 所引用，最后隐式的返回 this

#### new的模拟实现
```js
function objectFactory() {
  var obj = new Object(),//从Object.prototype上克隆一个对象
  Constructor = [].shift.call(arguments);//取得外部传入的构造器
  var F=function(){};
  F.prototype= Constructor.prototype;
  obj=new F();//指向正确的原型
  var ret = Constructor.apply(obj, arguments);//借用外部传入的构造器给obj设置属性
  return typeof ret === 'object' ? ret : obj;//确保构造器总是返回一个对象
};
```

> 这里说明对象的构造函数如果有返回值而且是基本类型是会被忽略掉的，引用类型的话则作为实例被返回，详见[链接](https://blog.csdn.net/liwenfei123/article/details/80580883)


### this对象的理解

`this `总是指向函数的直接调用者

如果有 `new` 关键字，`this` 指向 `new` 出来的实例对象

在事件中，`this` 指向触发这个事件的对象

IE 下 `attachEvent` 中的 `this` 总是指向全局对象 `Window`

箭头函数中，函数体内的this对象，就是定义时所在作用域的对象，而不是使用时所在的作用域的对象

```js
function foo() {
  console.log(this.a)
}
var a = 1
foo()           //1       
​
const obj = {
  a: 2,
  foo: foo
}
obj.foo()      //2
​
const c = new foo()   //undefined
```
对于直接调用 `foo` 来说，不管 `foo` 函数被放在了什么地方，`this` 一定是`window`

对于 `obj.foo()` 来说，我们只需要记住，谁调用了函数，谁就是 `this`，所以在这个场景下 `foo` 函数中的 `this` 就是 `obj` 对象

对于 `new` 的方式来说，`this` 被永远绑定在了 `new`出来的对象上，不会被任何方式改变 `this `

箭头函数其实是没有` this` 的，箭头函数中的 `this` 只取决包裹箭头函数的第一个普通函数的 `this`。在这个例子中，因为包裹箭头函数的第一个普通函数是 `a`，所以此时的 `this` 是 `window`。另外对箭头函数使用 `bind`这类函数是无效的

## apply、call、bind
`call`、`apply`和`bind`是Function对象自带的三个方法，都是为了改变函数体内部 `this` 的指向。

`apply` 、 `call` 、`bind` 三者第一个参数都是 this 要指向的对象，也就是想指定的上下文；

`apply` 、 `call` 、`bind` 三者都可以利用后续参数传参；

`bind` 是返回对应 函数，便于稍后调用；`apply` 、`call` 则是立即调用 

call 传入参数列表

apply 传入数组

bind() 方法会创建一个 新函数，当调用这个新函数时，新函数会以创建它时传入 bind() 方法的第一个参数 作为 this，传入 bind() 方法的 第二个以及以后的参数加上绑定函数运行时本身的参数按照顺序作为原函数的参数来调用原函数。

## 数据处理
### 数组去重
```js
var arr=['12','32','89','12','12','78','12','32'];
// 最简单数组去重法
function unique1(array){
    var n = []; //一个新的临时数组
    for(var i = 0; i < array.length; i++){ //遍历当前数组
        if (n.indexOf(array[i]) == -1)
            n.push(array[i]);
    }
    return n;
}
arr=unique1(arr);
```
> 这个太简单了，个人建议使用Set进行去重

### 排序
```js
/**
	 * 按 sort 及  id 排序
	 * @param {Object} a
	 * @param {Object} b
	 */
function   sortFun(a, b) {
  return a.sort - b.sort == 0 ? a.id - b.id : a.sort - b.sort
};
arr.sort(sortFun)   //从小到大排序
```

### 递归求和
```js
function add(num1,num2){
  var num = num1+num2;
  if(num2+1>100){
    return num;
  }else{
    return add(num,num2+1)
  }
}
var sum =add(1,2)
```

### 计算数组各项的重复次数
```js
var arr=['胡将','胡将','hujiang','胡将','胡江','hujiang'];
var obj={};
arr.sort();    //先排序
for(var i=0;i<arr.length;){
	var con=0;
	for(var j=i;j<arr.length;j++){
		if(arr[i]===arr[j]){
			con++
		}
	}
	obj[arr[i]]=con; 
	i=i+con;    //跳过重复的值
}
console.log(obj);  //{ hujiang: 2, '胡将': 3, '胡江': 1 }
```

## Event Loop

### 宏任务/微任务

除了广义的同步任务和异步任务，我们对任务有更精细的定义：

macro-task(宏任务)：当前调用栈中执行的任务称为宏任务。包括：script全部代码、setTimeout、setInterval、setImmediate（浏览器暂时不支持，只有IE10支持，具体可见MDN）、I/O、UI Rendering。

micro-task(微任务)： 当前（此次事件循环中）宏任务执行完，在下一个宏任务开始之前需要执行的任务为微任务。包括：Process.nextTick（Node独有）、Promise、Object.observe(废弃)、MutationObserver

不同类型的任务会进入对应的Event Queue，宏任务中的事件放在callback queue中，由事件触发线程维护；微任务的事件放在微任务队列中，由js引擎线程维护。

> 这个东西没给例子，可能很难理解，我之前看的这个[链接](https://juejin.im/post/59e85eebf265da430d571f89)

### 一句话解析下什么是event loop
主线程运行的时候会生成堆（heap）和栈（stack）

js 从上到下解析方法，将其中的同步任务按照执行顺序排列到执行栈中

当程序调用外部的 API 时（比如 ajax、setTimeout 等），会将此类异步任务挂起，继续执行执行栈中的任务。等异步任务返回结果后，再按照顺序排列到事件队列中

主线程先将执行栈中的同步任务清空，然后检查事件队列中是否有任务，如果有，就将第一个事件对应的回调推到执行栈中执行，若在执行过程中遇到异步任务，则继续将这个异步任务排列到事件队列中

主线程每次将执行栈清空后，就去事件队列中检查是否有任务，如果有，就每次取出一个推到执行栈中执行，这个循环往复的过程被称为“Event Loop 事件循环”

## 浏览器页面渲染过程
浏览器渲染页面的一般过程：

1. 浏览器解析html源码，然后创建一个 DOM树。并行请求 css/image/js在DOM树中，每一个HTML标签都有一个对应的节点，并且每一个文本也都会有一个对应的文本节点。DOM树的根节点就是 documentElement，对应的是html标签。

2. 浏览器解析CSS代码，计算出最终的样式数据。构建CSSOM树。对CSS代码中非法的语法它会直接忽略掉。解析CSS的时候会按照如下顺序来定义优先级：浏览器默认设置 < 用户设置 < 外链样式 < 内联样式 < html中的style。

3. DOM Tree + CSSOM --> 渲染树（rendering tree）。渲染树和DOM树有点像，但是是有区别的。

  DOM树完全和html标签一一对应，但是渲染树会忽略掉不需要渲染的元素，比如head、display:none的元素等。而且一大段文本中的每一个行在渲染树中都是独立的一个节点。渲染树中的每一个节点都存储有对应的css属性。

4. 一旦渲染树创建好了，浏览器就可以根据渲染树直接把页面绘制到屏幕上。

以上四个步骤并不是一次性顺序完成的。如果DOM或者CSSOM被修改，以上过程会被重复执行。实际上，CSS和JavaScript往往会多次修改DOM或者CSSOM。

## 浏览器缓存

原作者给的详情[链接](https://mp.weixin.qq.com/s?__biz=MzI5MjU0Mjk5MA==&mid=2247483826&idx=2&sn=e38f5e5b928a6aa5c15371505b4e8d71&chksm=ec7e8ed3db0907c545393ea90ee8bfd7dc944ff013957228b200d66929767251b1982340d036&token=816776520&lang=zh_CN#rd)

我之前看到的另外一篇比较好的文章[链接](https://imweb.io/topic/5795dcb6fb312541492eda8c)

# CSS
## 盒模型

盒模型的组成，由里向外content,padding,border,margin.

**在IE盒子模型中，width表示content+padding+border这三个部分的宽度**

**在标准的盒子模型中，width指content部分的宽度**

`box-sizing`的使用
```css
box-sizing: content-box; //是W3C盒子模型
box-sizing: border-box; //是IE盒子模型
```
`box-sizing`的默认属性是`content-box`

## 居中
### 水平居中
行内元素: `text-align: center`

块级元素:
```css
// 方法1 
margin: 0 auto;
// 方法2
position:absolute;
left:50%;
transform:translateX(-50%);
// 方法3
display:flex;
justify-content: center;
```

### 垂直居中
设置line-height 等于height
```css
// 方法一
position：absolute;
top:50%;
transform:translateY(-50%);
// 方法二
display:flex;
align-items: center;
// 方法三
display:table;
display:table-cell;
vertical-align: middle;
```

# 结语
一边百度一边看，回想起来不少知识，但是这个还是相对基础的部分，之后再找点难一些的，当然，基础不稳地动山摇，还是要好好复习基础的

祝各位找到合适自己的公司！奥里给！