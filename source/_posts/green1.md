---
title: 绿宝书学习笔记1
tags: [js, 基础, 绿宝书]
categories: [语言, js]
index_img: /img/green-title.png
banner_img: /img/dandelion.png
date: 2020-07-10 08:00:00
---
# 写在前边
这本书是今年六月份出版并印刷的，所以它相较于其他书籍更“新”，意味着更贴近我们现在的代码习惯，挺厚的，七百来页，我打算三周看完，一天也就35页左右，今天是第一天，希望我能一直坚持到看完这本书，祝我们变得更强！
# 第一章 二十年来的JavaScript
这一章主要介绍了作者本身的经历以及二十年来JavaScript的发展，从微软和网景的语言大战到最后的ES6，我通读了一遍，感觉没有什么需要记录下来东西，在此不做赘述
# 第二章 JavaScript的语法
对于JavaScript的语法叙述来讲《JavaScript权威指南》是最好的一本书，但是本书面向具有一定开发经验的程序员，所以本章只讨论语法中的关键部分，并不打算讨论更多细节

请关注每小节之前的对内容的概括和汇总性的表格，可能会和其他书籍以及你既有的知识不一致，但是这是我们后续进一步讨论语言的基础

## 2.1 语法综述
语言中的标识符一般分为两类，一类用于命名语法、符号等抽象概念，另一类用于命名数据。前者被称为语法关键字，后者被称为变量和常量，由此引入了一个概念：绑定。从标识符的角度来说，绑定分为语法关键字和语义逻辑的绑定，以及变量与它所存储数据和位置性质的绑定。

其中语法关键字和语义逻辑的绑定结果，是对`作用域`的限定，变量与它所存储数据和位置性质的绑定的结果，则是对变量`生存周期`的绑定

### 2.1.1 标识符所绑定的语义
声明的意义：所谓声明，即约定数据的生存周期和逻辑的作用域。
> 这里的声明已经涵盖了逻辑与数据（这相当于`程序`的全部），因此，整个编程的过程，其实被解释成了`"说明逻辑与数据"`的过程：
> 1. 纯粹陈叔“数据”的过程，被称为变量与类型声明。
> 2. 纯粹陈述“逻辑”的过程，被称为语句（包含逻辑控制语句）
> 3. 陈述“数据与（算法的）逻辑”的关系的过程，被称为表达式

除了“声明”在语义上对绑定内容的限制之外，当一个被声明的标识符（变量、常量或者符号）去绑定一个数据时，事实上还有其他两个方面的语义：数据（受作用域限制）的声明周期以及可写性

**在JavaScript中**
* 用于显式数据声明的`var let const`，函数声明以及类声明
* 数种for语句、try...catch语句、赋值语句
* 在函数调用和new运算符等语法中通过形参传入值

这些语义都存在着隐式或显式变量声明的原因：它们有着各自在“作用域、值和可写性”三方面的不同性质
### 2.1.2 识别语法错误与运行错误
如果在语法分析不通过，脚本代码块都不执行；当语法分析通过时，脚本代码才会执行。若运行过程中出错，则在同一代码上下文中，出错点之后的代码将不再执行

事实上，Node.js在命令行中传入的主文件也是作为模块加载的

可以在命令行上使用Node.js进行语法检测
```cmd
# 使用node -c 或者 --check 来进行语法查错
> echo . | node -c -
SyntaxError：Unexpected token .
# 这段代码没有问题所以Node.js直接返回
> echo null.toString | node -c -
```
## 2.2 JavaScript的语法：声明
JS是弱类型语言，只表明该语言在表达式运算中不强制操作数的数据类型，而并不表明该语言是否具有类型系统。所以说JS是“无类型(untype language)语言”是错误的。

以数据的可写性来看可分为变量和常量；以数据类型来看，有对象、函数、符号、和值类型数据等。另一种常见的分类方法是以声明语法来进行的，JS中有六种声明标识符的方法，包括变量（var），常量（coust），块作用域变量（let），函数（function），类（class）和模块（import），它们都可以声明出在语法分析阶段就被识别的标识符。还可以分为全局变量和局部变量。

### 2.2.1 变量的数据类型
| 类型 | 含义 | 说明 | 值/引用类型 |
|: -- :|: -- :|: -- :|: -- :|
| undefined | 未定义 | 未声明的或者声明过但是未赋值的变量，其值会是undefined。也可以显式或者隐式的给一个变量赋值为undefined | 值类型 |
| number | 数值 | 除赋值操作外，只有数值与数值的运算结果是数值；函数、方法返回值或者对象的属性值可以是数值 | 值类型 |
| string | 字符串 | 可以直接读取指定位置的单个字符，但不能修改 | 值类型 |
| boolean | 布尔值 | true / false | 值类型 |
| symbol | 符号 | 从ES6开始支持 | 值类型 | 
| function | 函数 | JS中的函数存在多重含义，函数、方法、构造器、生成器、类、以及函数对象等 | 引用类型 | 
| object | 对象 | 基于原型继承和类继承的面向对象类型 | 引用类型 | 


#### 2.2.1.1 基本数据类型
任何一个变量和值的类型都可以（而且应当首先）使用`typeof`运算得到，它是一个保留字，是一个运算符而不是一个函数，尽管看上过去可以在后边加上一对括号

值/引用类型已加入上表

在JS中，严格相等(===)运算符用来对值类型/引用类型的实际数据进行比较和检查，按照约定，在基于上述类型的运算中
* 一般表达式运算的结果总是值
* 函数/方法吊桶的结果可以返回值类型或者引用
* 值与引用、值与值之间即使相等(==)，也不一定严格相等(===)
* 两个引用之间如果相等(===)，则一定严格相等(===)

```js
var str = 'abcde'
var obj = new String(str)

function newToString() {
  return 'hello, world'
}
function func(val) {
  val.toString = newToString
}
func(str)
console.log(str) // 'abcde'
func(obj)
console.log(obj) // 'hello, world'
```
第一个只是传入了str的值，因此对它的toString属性的修改是无意义的，但是第二个传入的是引用，所以可以影响到后来的`toString()`的结果

### 2.2.2 变量声明
JS中变量声明有两种方法：
* 显式声明
* 隐式声明（即用即声明）
  
显式声明，一般指使用`var`等关键字进行的声明。包括在一些语句中使用`var`进行声明，包括`for`语句等，还有两种情况是指具名函数声明以及异常捕获子句中的异常对象`e`

而隐式声明一般发生在一般的赋值语句中

解释器总是将显式声明理解为“变量声明”，而对于隐式声明则不一定：
* 如果变量未被声明，则先声明该变量并立即给它赋值
* 如果该变量已被声明，则该语句就是赋值语句

#### 2.2.2.1 块级作用域的变量声明与一般var声明
除了以下三点不同，`let`的语法以及使用场景都和`var`一致
* `var`声明的变量，其作用域为当前函数、模块或者全局；`let`声明的变量，其作用域总是在当前的代码块，例如语句块
* 在同一个代码块中，可以用var来多次声明变量名，在语法分析中与声明一次没有区别；而用`let`却只能声明一次，覆盖一个已经声明的`let`变量（或者用`let`去覆盖一个已经声明过的标识符）会导致语法错误
* 用户代码可以在声明语句之前使用所声明的`var`变量，这时该变量的值为`undefined`；而`let`声明的变量必须先声明后使用，声明语句之前的代码引用了`let`变量会触发异常，这也会导致`typeof`成为一个不安全的运算

当`let`声明在全局代码块的时候会和`var`产生一些细微的区别，`var`声明之后相当于在全局对象`global`上声明了一个属性，进而使所有代码都能将这些声明作为全局变量来访问，而`let`与一些其他的语法元素都遵循“块级作用域”的规则，即使出现在全局代码块中，也不会成为`global`上的属性

> 常量声明`const`,类声明`class`在块级作用域上的特性和`let`声明是相类似的

#### 用赋值模板声明一批变量
JS声明一批变量的传统方法使使用`var`关键字，即在一个`var`中声明多个变量，而ES6开始支持更为灵活的结构赋值语法，这个表达式的左操作数称为“赋值模板(Assignment Pattern)”

当这个模板使用在`var`等变量声明中时，也可以成批地声明变量，例如
```js
// 使用数据结构赋值，声明变量x,y
var [x, y] = [1, 2]
// 使用对象结构赋值，声明变量height,width
let {clientHeight: height, clientWidht: width} = window.document.body;
```
还可以使用剩余参数语法来声明数组或对象。例如：
```js
// 在变量声明的赋值模板中使用剩余参数，可以声明数组变量more
var [x, y, ...more] = [1, 2, 3, 4, 5]

// 在对象解构赋值中使用剩余参数，可以声明对象变量moreProps
let {x, y, ...moreProps} = {x: 100, y:200, z: 300}
```

### 2.2.3 使用字面量风格的值
JS中没有类型声明的概念，因此这时变量声明就只用来说明一个变量的初值，在声明中，等号右边既可以时表达式————这意味着将表达式运算的结果作为该变量的初值，也可以是更为强大和灵活的字面量声明。

> 三种值类型、null值和正则表达式是被称为字面量的，而Function、Object、Array其实只是”字面量风格的声明“，他们严格来说仍然是存在着语义上的差异的
#### 2.2.3.1 字符串字面量、转义符
现在ES标准统一要求字符串必须是Unicode字符序列

转义序列列表：

| 转义符 | 含义 |
|: -- :|: -- :|
| \b | 退格符 |
| \t | 水平制表符 |
| \v | 垂直制表符 |
| \n | 换行符 |
| \r | 回车符 |
| \f | 换页符 |
| \\ | 反斜线字符 |
| \' | 单引号 |
| \" | 双引号 |
| \0 | 字符NUL |
| \xnn | ASCII 字符编码为nn的字符 |
| \unnnn | Unicode字符编码为nnnn的字符 |
| \u{nnnnn} | Unicode字符编码大于0xFFFF的字符 |


> `\`也用于表示连续的字符串声明，只要在行末加上\就可以换行继续写字符串了

#### 2.2.3.2 模板字面量

ES6开始出现的模板字面量(template literal)用一对反引号来标识，将其理解为一种增强的字符串声明，在使用反引号声明的字符串中，可以使用`${...}`这样的语法来捕获当前上下文中的变量、常量、字面量或者对象成员属性，以及计算一个表达式并将结果转换为字符串值——这也意味着这样的字符串其实是动态的，模板字面量本质上来说是一个字面量的引用——该字面量在JS内部表达为一个对象(array-like object)或者数组

它有一个`.row`属性指向该”表达该模板字面量的内部数组“的一个原始的、未经转义的格式。
```js
console.log(String.raw({raw: ['', '/nworld']}, 'Hi'))
/*
Hi,
World
*/
// 等同于
foo = tpl => String.raw(tpl, 'Hi');
console.log(foo`${1},
world`);
```

#### 2.2.3.3 数值字面量
数值字面量总是以一个数字字符，或者一个点字符，以及不多于一个正值符号或者负值符号开始，当数字一字符开始的时候有四条规则
* 0X或者0x，标明是十六进制
* 0o或者0O，表明是一个八进制
* 0b或者0B，表明是一个二进制
* 剩下的情况默认为十进制整数或者是浮点数

当以点字符开始时，总表明是一个十进制浮点数

### 2.2.4 其他声明
#### 2.2.4.1 常量声明
`const`关键字用于常量声明，除了不可更改之外的属性都类似于`let`
#### 2.2.4.2 符号声明
符号是从ES6开始支持的一种数据类型，它可以使用一般形式的变量声明或者常量声明(const/var/let)，与其他数据类型在声明上没有什么特别的不同

符号没有字面量声明形式，由于符号是值而非对象，所以也不能用`new`运算符来创建它
#### 2.2.4.3 函数声明
在JS中函数是一种数据类型，所以函数声明是变量声明的一种特殊形式
```js
function a() {}
```
在ES5以后的规范中，明确规定了在表达式中出现的具名函数名只影响函数内的代码，而不会影响该表达式所在的作用域

可以设定默认值，如果默认值并没有放在参数列表的尾部，那么可以使用Undefined，在传参时表明该参数使用默认值

可以使用剩余参数`...arg`来收集剩余的参数

> 使用class关键字来声明的类，也是一个函数。因此可以将类声明理解为函数声明的一种特殊语法，但是类声明得到的函数只能使用`new`运算来创建对象实例，而不能直接作为函数调用。而如果语法关键字`function`之后加`*`字符。则会声明一个特殊的函数：生成器。