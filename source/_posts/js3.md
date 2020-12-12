---
title: 你不知道的JavaScript（中）学习笔记
tags: [js, 基础]
categories: [语言, js]
index_img: /img/js-m-title.png
banner_img: /img/js.jpg
date: 2020-11-04 17:51:00
---

# JavaScript
##  类型和语法
### 类型
#### 内置类型
JS有七种内置类型`空值(null)`、`未定义(undefined)`、`布尔值(boolean)`、`数字(Number)`、`字符串(String)`、`对象(Object)`、`符号(Symbol)`

`typeof`检测**null**会得到"object", 使用`(!a && typeof a === 'object')`即可得到正确的结果

`typeof`检测**函数**会得到"function" ，但是函数是`object`的子类型，具体来说函数是“**可调用对象**”。

`typeof`检测**数组**会得到"object"，数组也是`object`的子类型。

#### 值和类型
JS的变量是没有类型的，只有值才有，变量可以随时持有任何类型的值

#### 对于未定义变量的检测
`typeof`检测对于**未定义变量**也返回`undefined`，这个机制可以帮助我们检测一个全局变量是否存在

```js
if (a) {
    ... // ReferenceError: a is not defined
}

if (typeof a !== undefined) {
    ... // OK
}
```

### 值
#### 数组
创建的"稀疏数组"中的空白单元会表现为`undefined`但是和实际上赋值为`undefined`仍有区别

字符串键值如果能被强制转化为数字，则会被转化成数字索引

为字符串键值赋值，数组总长度不会变化，即
```js
var a = []
a["1"] = 1
a["dd"] = '阿巴阿巴阿巴'
a.length === 2 // true
```

#### 字符串
字符串和数组很相似，都拥有`indexOf`、`concat`等方法，但是实际上并不相同

字符串值不可变，成员函数会返回一个新的字符串
```js
a = ['f', 'o' ,'o']
b = 'foo'
a[1] = 'O'
b[1] = 'O'

a // ['f', 'O', 'o']
b // foo
```

字符串可以借用很多数组的方法，譬如`join`、`map`，不过对于字符串反转来讲，由于字符串不可变所以不可以直接用`reverse`，替代方法是
```js
var a = 'abc'
var b = a
    // 将a的值转化为字符数组
    .split("")
    // 将数组中的值进行倒转
    .reverse()
    // 将数组中的值拼回字符串
    .join("")
b // "cba"
```
> 注意：以上方法只适用于简单的字符串，对于复杂字符（UniCode、星号、多字节字符等）的字符串并不适用，去网上找库去

#### 数字
js中只有一种数字，包括整数和带小数的十进制数，整数即是没有小数的十进制数。所以42.0等于“整数”42

js使用的是“双精度”格式，即64位二进制

##### 数字的语法

不要直接在字面量数字后边调用方法，`.`操作符会被认为是数字的小数点
```js
// 无效语法：
42.toFixed( 3 ); // SyntaxError
// 下面的语法都有效：
(42).toFixed( 3 ); // "42.000"
0.42.toFixed( 3 ); // "0.420"
42..toFixed( 3 ); // "42.000" 请注意多出来的点
42 .toFixed( 3 ); // "42.000" 请注意空格
```

可以用指数形式来表示比较大的数字，特别大和特别小的数字默认用指数格式显示，与 `toExponential()` 函数的输出结果相同

```js
var a = 5E10;
a; // 50000000000
a.toExponential(); // "5e+10"
var b = a * a;
b; // 2.5e+21
var c = 1 / a;
c; // 2e-11
```

##### 整数的安全范围
能够被“安全”呈现的最大整数是 2^53 - 1，即 `9007199254740991`，在 ES6 中被定义为**Number.MAX_SAFE_INTEGER。**

最小整数是 `-9007199254740991`，在 ES6 中被定义为 **Number.MIN_SAFE_INTEGER。**

##### void 运算符
我们可以使用`void 0`来获得`undefined`

void加在表达式之前可以让表达式返回`undefined`
```js
return void doSomething();
// -> 等同于
doSomething();
return;
```

##### 特殊的数字
`NaN`意指“不是一个数字”，typeof检测仍返回"number"，不过它不和任何东西相等，即使是`==`，可以使用`Number.isNaN()`来进行判断

> 不要使用全局`isNaN()`，它有BUG！

js使用有限数字表示法，所以一旦计算结果溢出为“无穷数”，就无法再得到“有穷数”

js中存在`-0`值，是因为在一些应用中，符号位可能会代表其他信息，譬如方向，如果一个值为0的变量失去了它的符号位，那么方向信息可能就会丢失，日常代码中几乎不会遇见

ES6中新加入了一个工具方法`Object.is()`来判断两个值是否绝对相等，可以用来处理所有特殊情况
```js
var a = 2 / "foo";
var b = -3 * 0;
Object.is( a, NaN ); // true
Object.is( b, -0 ); // true
Object.is( b, 0 ); // false
```

> 能使用`==`或者`===`就不要使用`Object.is()`，因为前者效率更高