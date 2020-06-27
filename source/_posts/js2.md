---
title: 你不知道的JavaScript（下）学习笔记
tags: [js, 基础]
categories: [语言, js]
index_img: /img/js-title.jpg
banner_img: /img/js.jpg
date: 2020-06-27 14:30:00
---
# JavaScript
## 基础
### prompt
用法`var input = prompt(text,defaultText)`

> text 	可选。要在对话框中显示的纯文本（而不是 HTML 格式的文本）。
> defaultText 	可选。默认的输入文本。

### 比较

如果两边任意一边出现 `true` 或者 `false` 使用 **===**

如果两边任意一边可能是特定值`0,"", []` 使用 **===**

剩下的所有情况,使用 **==**

对于引用类型来说,比较仅仅是比较其引用是否是同一个,另外在和字符串比较时,数组会自动转成字符串

```js
var a = [1,2,3]
var b = [1,2,3]
var c = "1,2,3"
console.log(a == b) // false
console.log(a == c) // true
console.log(b == c) // true
```

### switch语句
```js
switch(a) {
  case 2:
  case 10:
    // 2 或者 10 执行
    break;
  default:
    // 条件都不满足默认执行
}
``` 

## ES6

### 声明
let 尽量将变量声明放在代码块开始,避免在(Temproal Dead Zone, TDZ)**临时死亡区**使用而报错

> 尽量使用for...let,在每次循环中都会声明一个新的变量,生成了一个闭包。避免for里边的函数在调用的时候引用不到正确的变量。

const声明,相对于保护其中的内容更注重其语意所带来的规范性

如果把方法定义在{}内,那么在块外执行会报ReferenceError

### spread/rest解构重构
spread/rest`...`放在数组前用于展开数组,放在变量前就是收集变量到一个数组里,例如 `function a(...arg){} a(a,b,c) -> arg = [a,b,c]`

解构 `var [a, b, c] = foo()` 如果foo返回的是一个长度为三的数组其内容将会被依次赋值给abc

对象属性复制模式`var {a, b, c} = foo()`这里省略的其实是`a:, b:, c:`,对象的属性名要和函数返回的属性名相同,然后将值一一赋值给属性值`var {a: x, b: y, c: z} = foo()`最后使用的是`xyz`而不是`abc`

> 对于这个形式,如果省略声明符就需要用小括号括起来`({a, b, c} = foo())`

使用**对象属性名的计算属性**`var which = 'w'; o1 = {which: 'w'}; => {which: 'w'}   o2 = {[which]: 'w'}; => {w: 'w'}`使用中括号即可使用变量里边的内容作为属性名

简单的交换两个元素`[a, b] = [b, a]`

允许出现多次列出同一个源属性`{a: {x: X, x: Y}, a} = {a: {x: 1}} => X == Y == 1, a = {x :1}`

> 不必都写在一行里,解构的目的不是为了打字更少,而是为了可读性更强

赋值的时候用不到的东西可以抛弃`[,a,b] = [1, 2, 3] => a = 2, b = 3`

赋值的时候多余的东西会赋值undefined`[a, b] = [1] => a = 1, b = undefined`

赋值的时候可以使用spread/rest`...`进行收集操作`[...a,b] = [1, 2, 3] => a = [1, 2], b = 3`

赋值的时候可以使用默认值`{a, b: WW = 20} = {a: 10}  => a = 10, WW = 20`

赋值的时候可以嵌套结构

在形参中使用这个就接近了命名参数,得到了任意位置的可选参数功能

设置默认参数`{x = 10} = {}`,
> 比较一下`{y} = {y: 10}`与`{x = 10} = {}`
> 对于x这种新式的用法来说，如果第一个参数省略或者是undefined，就会应用{}空对象默认值，然后，在第一个参数位置传入的任何值——或者是默认{}或者是你传入的任何值，都是用`{x = 10}`进行解构，这会检查是否存在x属性，如果没有或者是undefined，就会自动赋值为10，所以x不论传入什么，只要没指定x就是10，y则在未传入或者传入undefined嗯嗯时候才会赋值为10

### 对象字面量拓展
简洁属性`{x}`

简洁方法`{x(){}}`

> 这个操作会生成一个匿名的函数,如果需要递归请不要使用

### 模板字面量
使用``...${foo(`${name}s`)}``

#### 标签模板字面量
```js
  function foo(strings, ...args) {
    console.log(strings)
    console.log(args)
  }
  var desc = "awesome"
  foo`Every thing is ${desc}!`
  // ["Every this is ", "!"]
  // ["awesome"]
```
配合String.reduce遍历字符串可以达成本地化之类的功能

### 箭头函数
合理使用，函数越短越适合用，函数长了反而会使函数边界模糊

主要的功能是为了this的规范化而不是减少代码量

尽可能减少非必要情况下的箭头函数使用

### for ... of 循环
`for ... in` 遍历的时候遍历的是 index（从0开始） `for ... of`遍历的是值

适用所有带迭代器的变量

自带迭代器的有Arrays,Strings,Generators,Collections/TypedArrays

`...`可以是赋值表达式也可以是声明

> Object 不可迭代所以用不了，非要用自己写个`[Symbol.iterator]`挂prototype上或者自己extend一个

### 正则匹配
#### 定点标识

`re = /d/ re.lastIndex`

定点定位`/f../y`会从lastIndex开始搜索,不会更新lastIndex

g模式使用exec 会更新lastIndex

^ 总是指向输入起始处的锚点,不受lastIndex的影响

y 加上 ^ 加上lastIndex > 0 是一个不兼容的组合,总是会导致失败

#### flags
`re = /foo/ig re.flags => gi`查看应用的哪些标识
  
顺序总是`gimuy`

### 数字字面量扩展
`doc = 12`

`oct = 0o52`

`hex = 0x2a`

`bin = 0b101010`

`a = 42 a.toString(10 || 8 || 6 || 2)`可以进行转换

### Unicode
`var snowman = '\u2603'` \u转义

`var gclef = '\uD834\uDD1E'` 替代对

`var gclef = '\u{1D11E}'` 码点转义

#### 精确判断字符串长度
`[...str].length`

`Array.from(str).length`

### 符号Symbol
使用例子`var sym = Symbol('something')`

> 不应该使用new

使用`typeof`识别

获取全局符号（如果全局不存在则新建一个放在全局）`Symbol.for("exec.name")`

通过符号获取字符串`Symbol.keyFor(sym)`

设置为对象的属性之后不可枚举,但是可以通过`Object.getOwnPropertySymbols(sym)`获取

### 迭代器

可以用来满足消费者生产者模型

必须拥有一个next()

可选return()用于消费者向生产者发送所有消费过程完成的信号,生产者应进行销毁程序

可选throw()用于向生产者发送错误信号,终止生产

for of 可以消费迭代器,使用break退出会触发return

通过spread/rest运算符可以消耗迭代器`it = arr[Symbol.iterator]() var [x, y] = it; var [z, ...w] = it;` it最终会被消耗光

### 生成器

`function *foo() {yield 1;} it = foo() it.next() // value 1 ` next里边的参数会替换掉 yield后边的东西

就是用迭代器来控制生成器

可以用throw()配合try catch实现错误的双向或 内外双向传递

每次被调用的时候都会是一个新的生成器

加* 

### 模块
`import` 和 `export` 必须在使用它们的最顶层作用域

#### 命名导出
```js
// 方式一
export var bar = [1,3,4]; export function foo() {}
// 方式二
var bar = []; function foo() {}; export {bar, foo}
```
#### 导出的是在模块内的最后的值
```js
var a = 1
export { a }
a = 2
// -> 最后导出的是2而不是1
```
#### 导出可以指定名称
```js
var a = 1
export { a as b }
// -> 只有b可以被导入,a被隐藏
```

> 导入不是赋值操作,而是类似指针一样的绑定
> es6倾向于一个文件一个export,可以使import变得简单
#### 默认导出的两种形式
```js
export default function foo() {} // -> 导出的是表达式的绑定
function foo() {} export default foo // -> 同上,即`export default`接受的是一个表达式
function foo() {} export { foo as default } // -> 导出的是标识符的绑定,也就是导出foo在文件中最后的值
```
> 一个模块只能有一个default
```js
// 方式一
export default function foo() {}
export function bar() {}
// 方式二
function foo() {}
function bar() {}
export { foo as default, bar }
```
#### 可以导出别的模块的导出 -> 感觉可以用来集成模块,,也没啥用
```js
export { foo, bar } from 'baz'
export { foo as FOO, bar as BAR } from 'baz'
export * from 'baz'
  ```
导入模块如果有default`import foo from "baz"`引入那个default

对导入进行重命名`import { foo as Foo } from "baz" -> Foo()`

对复合导入`import FOOFN, { bar, baz } from "baz"`

命名空间导入`import * as foo from "foo" -> foo.bar()`当前只能全部导入

如果有默认导出,就是`foo.default()`

默认+命名空间`import foofn, * as hello from "world"` `foofn -> hello.default` 尽量不要用这种迷惑操作

所有导入的绑定都是只读的,所有的赋值操作都会报错

所有导入都会被提升,全局访问

### 类
使用`class`声明类,类名大写
```js
class Foo {
  constructor(a, b) {
    this.x = a;
    this.y = b;
  }
  gimmeXY() {
    return this.x * this.y
  }
}
```
不能使用call所以只能通过new实例化

类不能被提升,所以实例化之前必须声明

声明一个class并没有创建一个同名的全局对象属性

class本身并不是一个实体,而是一个包裹着其他像函数和属性这样的具体实体并把它们组合到一起的元概念

class也可以是一个表达式
```js
var x = class Y {} // -> 对于把类定义(严格说是构造器本身)作为函数参数传递,或者把它赋值给一个对象属性的时候特别管用
```
把类理解为一个宏,用于自动产生一个prototype对象

类对extends以及super提供语法糖
```js
class Bar extends Foo {
  constructor(a, b, c) {
    super(a, b)
    this.z = c
  }
  gimmeXYZ() {
    return super.gimmeXY() * this.z
  }
}
```

如果子类不定义构造函数就会
```js
constructor(...args) {
  super(...args)
}
```
> 子类不在构造器中使用`super`是无法使用`this`的

可以拓展原生类
```js
class MyCoolArray extends Array {
  first() {return this[0]}
  last() {return this[this.length -1 ]}
}
a = new MyCoolArray(1, 2, 3)
a.first()
```
`new.target`在构造器中访问new直接调用的构造器

### Promise
决议的结果只可能是完成或者拒绝,附带一个可选的单个值,如果拒绝,那么最终的值称为原因

只能被完成或者拒绝一次,之后完成或者拒绝的操作都会被忽略

创建一个Promise
```js
var p = new Promise(function(resolve, reject) {
  // 成功
  resolve(arg)
  // 采用另一个Promise的决议值
  resolve(promise)
  // 拒绝
  reject(why)
})
// 调用
// then接受两个函数第一个是完成,第二个是拒绝时执行
p().then(
  function fulfilled(res) {},
  funcrion rejected(err){},
)
```
不论是`.then`还是`.catch`都会返回一个Promise,可以用`.then`进行处理

只要是函数里边包含`then`方法都会被认为是一个`thenable`所以不要盲目信任自称是Promise的东西

#### Promise API
`Promise.resolve`
```js
var p1 = Promise.resolve(42)
var p2 = new Promise(function pr(resolve){resolve(42)})
// p1 和 p2 的最终行为方式是相同的
```
这个接口提供了一个规范化Promise的方法,可以将刚刚不可信任的thenable放进去规范化
##### `Promise.reject`
和上边的一样创建一个立即被拒绝的promise,但是如果他的参数是Promise,它不会理会传进来得Promise的决议值
##### `Promise.all([])`
接受一个或者多个值的数组,比如立即值、Promise、thenable,它返回一个promise,如果里边的所有值都是完成则决议结果是完成,其中某一个被拒绝这个Promise就立即被拒绝

> 是等待所有都完成或者第一个拒绝
##### `Promise.rase([])`
等待第一个完成或者拒绝

> 也就是说返回第一个完成的决议值

### 集合
#### TypedArray
```js
// 创建一个buffer,长度为32字节,一共256位
var buf = new ArrayBuffer(32)
console.log(buf.byteLength) // 32
// 将这256位映射成一个16位无符号整型的类型数组
var arr = new Uint16Array(buf)
console.log(arr.length) // 16
```
#### 大小端
是指多字节数字中的低字节位于这个数字字节表示中的右侧还是左侧

举个例子,设想一个十进制数字3085,我们需要用16位来表示它。如果只是用一个十六位数字容器,那么不论大小端配置如何都是0000110000001101B,或者0c0dH

但是如果用两个八位数组表示数字3085,那么大小端就会明显影响他在内存中的存储表示：
  * 0000110000001101/0c0d（大端）
  * 0000110100001100/0d0c（小端）

快速监测JavaScript大小端的方法
```js
var littleEndian = (function() {
  var buffer = new ArrayBuffer(2);
  new DataView( buffer ).setInt16(0, 256, true)
  return new Int16Array(buffer)[0] === 256;
})();
```
#### Map
当前的js的对象的键只支持字符串
```js
var m = {}
var x = { id : 1 }
var y = { id : 2 }
m[x] = "foo"
m[y] = "bar"
m[x] // "bar"
m[y] // "bar"
```
因为x,y两个对象字符串化都是"[object object]", 所以m中只有一个键

##### ES6
```js
var m = new Map();
var x = { id : 1 }
var y = { id : 2 }
m.set(x, "foo")
m.set(y, "bar")
m.get(x)
m.get(y)
m.delete(x)
m.clear()
m.size
```
只是不能使用`[]`的方式来进行访问了,但是可以用set、get完美替换,删除的话不能用`delete`操作符,要用`delete()`方法,完全清空map用`clear()`方法,访问映射的大小用`size`属性

`new`的时候可以传入一个二维数组`[[key, value]]`

##### Map值
使用`value()`
```js
var m = new Map()
var x = {id: 1},
    y = {id: 2}
m.set(x, "foo")
m.set(y, "bar")
var vals = [...m.values()]
vals // ["foo","bar"]
Array.from( m.values())
// 使用entries迭代
vals = [...m.entries()]
vals[0][0] === x; // true
vals[0][1];       // "foo"
vals[1][0] === y; // false
vals[1][1];       // "bar"
```

##### Map键
使用`keys()`
```js
var keys = [...m.keys()]
keys[0] === x;    // true
keys[1] === y;    // true
```
查看是否有给定的键
```js
m.has(x);         // true
m.has(z);         // false
```
map的本质是允许你把某些额外的信息关联到一个对象上,而无需把这个信息放入对象本身

##### weakmap
作为键的对象被回收后会被自动删除,多用于dom中

> 没有size,没有clear()

#### Set

是一个值得集合,其中得值唯一（重复会被忽略）

用add()代替set(),没有get()
```js
var s = new Set()
var x = {id: 1}
var y = {id: 2}
s.add(x) 
s.add(y) 
s.add(x)
s.size // 2
s.delete(y)
s.size // 1
s.clear() // 0
s.size // 0
```
初始化可以放进去一个构造器
```js
var x = {id: 1}
var y = {id: 2}
var s = new Set([x, y])
s.has(x) // true
```

### 新增API
#### Array
##### 静态函数Array.of()
正常使用`new Array(4)`会生成一个长度为4得空数组,但是使用`of`就能生成长度为1值为4的数组
##### 静态函数Array.from()
`Array.from({length:4})` 生成4个undefined可以避免空槽位

映射`Array.from(arr, function(val, idx){return}, this)`对每一个值进行进行映射处理,类似.map(),如果有第三个参数,则会被绑定为第二个函数的this

##### 原型方法copyWithin()

从一个数组中复制一部分到同一个数组的另一个位置,覆盖这个位置所有原来的值,如果有任何一个参数是负值,就被当作是相对于数组结束的相对值
```js
[1,2,3,4,5].copyWithin(3,0); // [1,2,3,1,2]
[1,2,3,4,5].copyWithin(3,0,1); // [1,2,3,1,5]
[1,2,3,4,5].copyWithin(0,-2); // [4,5,3,4,5]
[1,2,3,4,5].copyWithin(0,-2,-1); // [4,2,3,4,5]
```
> 用的时候输出一下结果,避免不是想要的结果
##### 原型方法fill()
填充数组,第一个参数是要填充的内容,然后是填充的开始和结束
```js
[null, null, null, null].fill(42, 1, 3) // [null, 42, 42, null]
```
##### 原型方法find()
indexOf是用的===导致'2'不能与2匹配

es5中的变通方法是用some方法对每个元素调用一个函数回调,直到某次返回为true为止,因为可以定义回调函数,所以拥有了对匹配方式的完全控制,但是最后只能得到匹配的true或者false提示,无法的到真正的匹配值本身

find()与some()基本一致,除了一旦返回值是真值,会返回实际的数组值,如果没找到会返回undefined
```js
var a = [1,2,3,4,5]
var b = a.find(function matcher(v){
  return v == '2'
})
console.log(b) // 2
```
##### 原型方法findIndex()
和find()一样对每个元素调用一个函数回调,但是如果返回是true则会返回index,如果没找到返回-1

> 不要使用findIndex(..) != -1(这是indexOf的惯用法)从搜索中得到布尔值,因为some()已经yield出你想要的true/false。也不要用a[a.findIndex(..)]来得到匹配值,因为这是find()所作的事。最后如果需要严格匹配的索引值,那么使用indexOf()；如果需要自定义匹配的索引值,那么使用findIndex()

接受回调的数组方法接收一个可选的第二个参数,如果设定这个参数就绑定到第一个参数回调的this,否则this就是undefined

原型方法entries()、values()、keys()
> 同SET,MAP差不多
```js
var a = [1, 2, 3]
[...a.values()] // [1,2,3]
[...a.keys()]   // [0,1,2]
[...a.entries()] // [[0,1],[1,2],[2,3]]
[...a[Symbol.iterator]()] // [1,2,3]
```

#### Object
##### 静态函数Object.is()
执行比===更严格的值比较,应该继续使用===进行严格相等比较,不可当作这个运算符的替代,如果需要严格识别NaN或者-0,则应该选择Object.is()
```js
var x = NaN, y = 0, z = -0
x === x  // false
y === z  // true
Object.is(x,x) // true
Object.is(y,z) // false
```
##### 静态函数Object.getOwnPropertySymbols()
Symbol可能会成为对象最经常使用的特殊(元)属性。所以引入了这个工具直接从对象上回去所有的符号属性
```js
var o = {
  foo: 42,
  [Symbol("bar")]: "hello world",
  baz: true
}
Object.getOwnPropertySymbols(o); // [Symbol(bar)]
```
##### 静态函数Object.setPrototypeOf()
用于设置对象的[[Prototype]]用于行为委托
```js
var o1 = {foo() {}}
var o2 = {baz() {}}
Object.setPrototypeOf(o2, o1)
o2.foo()
// 或者
var o2 = Object.setPrototypeOf({baz(){}},o1)
o2.foo()
```
##### 静态函数Object.assign()
第一个参数是target,剩下的所有参数的传入的源,按照传入的顺序依次处理,对于每个源来讲,他的可枚举属性和自己拥有的简直,包括符号都会通过简单的=赋值被复制,会返回目标对象,经过实测,后边的会覆盖前边的值,如果不想这样就使用符号,只读属性可被复制：复制后是个普通属性，不可枚举属性不可复制，不可枚举符号不可被复制

而且除了setPrototypeOf可以链接[[prototype]]还可以使用
```js
var o1 = {foo(){}}
var o2 = Object.assign(Object.create(o1),{// o2 的定义})
o2.foo()
```

#### Math
##### 静态属性
Number.EPSILON任意两个值之间的最小差

Number.MAX_SAFE_INTEGER可以用数字值无歧义“安全表达”的最大整数：2^53 - 1

Number.MIN_SAFE_INTEGER可以用数字值无歧义“安全表达” 的最小整数：-(2^53-1) 或 (-2)^53 + 1

##### 静态函数Number.isNaN()
是对于全局函数isNaN()的修正，可以按期望工作

##### 静态函数Number.isFinite()
判断数字是不是非无限的，能排除掉NaN和Infinity

全局的isFinite()会强制进行类型转换，而这个不会

##### 整型相关静态函数
正常情况下是检查小数部分是否非0 x===Math.floor(x)

ES6新增Number.isInteger(),可以更有效的判断这个性质，同时排除了NaN 和 Infinity 返回false，对于4,4.0,4.00都会返回true

#### 字符串
##### 原型函数repeat()
在python和ruby这样的语言中，可以这样重复字符串`"foo" * 3 // 'foofoofoo'`

ES6中`"foo".repeat(3) // 'foofoofoo'`
##### 字符串检查函数
`str.startsWith("some") // true`

`str.endsWith("some") // true`

`str.includes("some") // true`

不会接受正则表达式用于搜索，而且如果搜索空字符串一般会在开始或者结尾找到