---
title: typescript学习笔记（基础篇2
tags: [ts, 基础2]
categories: [语言, ts]
index_img: /img/ts.jpg
banner_img: /img/ts.jpg
date: 2020-04-05 23:16:00
---
# typescript基础
[TypeScript入门教程](https://ts.xcatliu.com)
## 写在前边
这只是一个笔记，并不是教程，阮一峰大佬写的教程链接在上边
### 函数
- 函数声明定义
```ts
function sum(x: number, y: number): number {
    return x + y;
}
```
> 输入多余的（或者少于要求的）参数，是不被允许的

- 函数表达式定义
```ts
let mySum: (x: number, y: number) => number = function (x: number, y: number): number {
    return x + y;
};
```
> 注意不要混淆了 TypeScript 中的 => 和 ES6 中的 =>。
> 在 TypeScript 的类型定义中，=> 用来表示函数的定义，左边是输入类型，需要用括号括起来，右边是输出类型。
> 在 ES6 中，=> 叫做箭头函数，应用十分广泛，可以参考 ES6 中的箭头函数。

- 用接口定义函数的形状
```ts
interface SearchFunc {
    (source: string, subString: string): boolean;
}
let mySearch: SearchFunc;
mySearch = function(source: string, subString: string) {
    return source.search(subString) !== -1;
}
```
> 采用函数表达式|接口定义函数的方式时，对等号左侧进行类型限制，可以保证以后对函数名赋值时保证参数个数、参数类型、返回值类型不变。

- 可选参数
与接口中的可选属性类似，我们用 `?` 表示可选的参数
```ts
function buildName(firstName: string, lastName?: string) {
    if (lastName) {
        return firstName + ' ' + lastName;
    } else {
        return firstName;
    }
}
let tomcat = buildName('Tom', 'Cat');
let tom = buildName('Tom');
```
> 需要注意的是，可选参数必须接在必需参数后面。换句话说，可选参数后面不允许再出现必需参数了

- 参数默认值
TypeScript 会将添加了默认值的参数识别为可选参数
```ts
function buildName(firstName: string, lastName: string = 'Cat') {
    return firstName + ' ' + lastName;
}
let tomcat = buildName('Tom', 'Cat');
let tom = buildName('Tom');
```
> 此时就不受「可选参数必须接在必需参数后面」的限制了

- 剩余参数
ES6 中，可以使用 `...rest` 的方式获取函数中的剩余参数（rest 参数）

事实上，items 是一个数组。所以我们可以用数组的类型来定义它
```ts
function push(array: any[], ...items: any[]) {
    items.forEach(function(item) {
        array.push(item);
    });
}

let a = [];
push(a, 1, 2, 3);
```
> rest 参数只能是最后一个参数

- 重载

重载允许一个函数接受不同数量或类型的参数时，作出不同的处理。

比如，我们需要实现一个函数 reverse，输入数字 123 的时候，输出反转的数字 321，输入字符串 'hello' 的时候，输出反转的字符串 'olleh'。

利用联合类型，我们可以这么实现：
```ts
function reverse(x: number): number;
function reverse(x: string): string;
function reverse(x: number | string): number | string {
    if (typeof x === 'number') {
        return Number(x.toString().split('').reverse().join(''));
    } else if (typeof x === 'string') {
        return x.split('').reverse().join('');
    }
}
```
上例中，我们重复定义了多次函数 `reverse`，前几次都是函数定义，最后一次是函数实现。在编辑器的代码提示中，可以正确的看到前两个提示。
> 注意，TypeScript 会优先从最前面的函数定义开始匹配，所以多个函数定义如果有包含关系，需要优先把精确的定义写在前面。

### 断言
使用 `值` as `类型` 的语法
```ts
interface Cat {
    name: string;
    run(): void;
}
interface Fish {
    name: string;
    swim(): void;
}

function isFish(animal: Cat | Fish) {
    if (typeof animal.swim === 'function') {  // 会报错，因为swim不是Cat和Fish的共有属性
        return true;
    }
    return false;
}

function isFish(animal: Cat | Fish) {
    if (typeof (animal as Fish).swim === 'function') { // 使用断言，避免错误
        return true;
    }
    return false;
}
```
> 类型断言只能够「欺骗」TypeScript 编译器，无法避免运行时的错误，反而滥用类型断言可能会导致运行时错误
```ts
window.foo = 1; // 直接赋值会提示你window上边没有foo属性
(window as any).foo = 1; // 把window断言成一个any就可以随便赋值了
```
- 总结

联合类型可以被断言为其中一个类型

父类可以被断言为子类

任何类型都可以被断言为 any

any 可以被断言为任何类型

要使得 A 能够被断言为 B，只需要 A 兼容 B 或 B 兼容 A 即可