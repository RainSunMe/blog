---
title: TypeScript学习笔记（基础篇1
tags: [ts, 基础1]
categories: [语言, ts]
index_img: /img/ts.jpg
banner_img: /img/ts.jpg
date: 2020-04-05 16:07:00
---
# TypeScript基础
[TypeScript入门教程](https://ts.xcatliu.com)
## 写在前边
这只是一个笔记，并不是教程，阮一峰大佬写的教程链接在上边
## 安装
```
cnpm install -g typescript
```
## 编译
```
tsc hello.ts
```
> 我们约定使用 TypeScript 编写的文件以 .ts 为后缀，用 TypeScript 编写 React 时，以 .tsx 为后缀。
## 注意
TypeScript 中，使用 : 指定变量的类型，: 的前后有没有空格都可以。
> TypeScript 只会进行静态检查，如果发现有错误，编译的时候就会报错。
> 如果要在报错的时候终止 js 文件的生成，可以在 tsconfig.json 中配置 noEmitOnError 即可。关于 tsconfig.json，请参阅[官方手册](https://zhongsp.gitbooks.io/typescript-handbook/content/doc/handbook/tsconfig.json.html)

## 基础
JavaScript 的类型分为两种：原始数据类型（Primitive data types）和对象类型（Object types）。

原始数据类型包括：布尔值、数值、字符串、null、undefined 以及 ES6 中的新类型 Symbol。

### 布尔值
`boolean`
```ts
let isDone: boolean = false;
```
注意，使用构造函数 **Boolean** 创造的对象不是布尔值：
```ts
let createdByNewBoolean: boolean = new Boolean(1); // 会报错的，是一个Boolean对象
let createdByNewBoolean: boolean = Boolean(1); // 通过，是一个boolean
```
> 在 TypeScript 中，boolean 是 JavaScript 中的基本类型，而 Boolean 是 JavaScript 中的构造函数。其他基本类型（除了 null 和 undefined）一样，不再赘述。
### 数值
`number`
```ts
let decLiteral: number = 6;
let hexLiteral: number = 0xf00d;
// ES6 中的二进制表示法
let binaryLiteral: number = 0b1010;
// ES6 中的八进制表示法
let octalLiteral: number = 0o744;
let notANumber: number = NaN;
let infinityNumber: number = Infinity;
```
> 编译完会自动转成十进制

### 字符串
`string`
```ts
let myName: string = 'Tom';
let myAge: number = 25;
// 模板字符串
let sentence: string = `Hello, my name is ${myName}.
I'll be ${myAge + 1} years old next month.`;
```
> 编译完模板字符串会变成加号串联的形式，自动加`/n`

### 空值
`void`

**JavaScript** 没有空值（Void）的概念，在 **TypeScript** 中，可以用 `void` 表示没有任何返回值的函数：
```ts
function alertName(): void {
    alert('My name is Tom');
}
```
> 声明一个 `void` 类型的变量没有什么用，因为你只能将它赋值为 `undefined` 和 `null`

### Null 和 Undefined
`null undefined`
```ts
let u: undefined = undefined;
let n: null = null;
```
> 与 `void` 的区别是，`undefined` 和 `null` 是所有类型的子类型。也就是说 `undefined` 类型的变量，可以赋值给其他类型的变量，但是反过来 `void` 不能赋值给任何类型的变量

### 任意值
`any`
如果是一个普通类型，在赋值中改变类型是不被允许的。

但是如果是`any`类型，则允许被赋值为任意类型
```ts
let myFavoriteNumber: any = 'seven';
myFavoriteNumber = 7;
```
> 可以认为，声明一个变量为任意值之后，对它的任何操作，返回的内容的类型都是任意值。

变量如果在声明的时候，未指定其类型，那么它会被识别为任意值类型
```ts
let something;
something = 'seven';
something = 7;

something.setName('Tom');
```
### 类型推论
如果变量在定义的时候赋值，但是没指定类型，会自动进行推论
```ts
let myFavoriteNumber = 'seven';
// 等价于
let myFavoriteNumber: string = 'seven';
myFavoriteNumber = 7; // 会报错
```
> 如果定义的时候没有赋值，不管之后有没有赋值，都会被推断成 `any` 类型而完全不被类型检查：

### 联合类型
联合类型使用 | 分隔每个类型。
```ts
let myFavoriteNumber: string | number;
myFavoriteNumber = 'seven'; // ok
myFavoriteNumber = 7; // ok
myFavoriteNumber = true; // 会报错
```
当 TypeScript 不确定一个联合类型的变量到底是哪个类型的时候，我们只能访问此联合类型的所有类型里共有的属性或方法：
```ts
function getLength(something: string | number): number {
    return something.length; // 会报错，.length不是string和number共有的属性
    return something.toString(); // ok
}
```
联合类型的变量在被赋值的时候，会根据类型推论的规则推断出一个类型
```ts
let myFavoriteNumber: string | number;
myFavoriteNumber = 'seven';
console.log(myFavoriteNumber.length); // 5
myFavoriteNumber = 7;
console.log(myFavoriteNumber.length); // 会报错
```
### 接口
在面向对象语言中，接口（Interfaces）是一个很重要的概念，它是对行为的抽象，而具体如何行动需要由类（classes）去实现（implement）。

TypeScript 中的接口是一个非常灵活的概念，除了可用于对类的一部分行为进行抽象以外，也常用于对「对象的形状（Shape）」进行描述。
```ts
interface IPerson {
    name: string;
    age: number;
}

let tom: IPerson = {
    name: 'Tom',
    age: 25
};
```
接口一般首字母大写，有的编程语言会建议接口的名称加上`I`前缀

定义的变量比接口多属性少属性都是不允许的，**赋值的时候，变量的形状必须和接口的形状保持一致。**

- 可选属性

**可选属性的含义是该属性可以不存在**，这时**仍然不允许添加未定义的属性**
```ts
interface Person {
    name: string;
    age?: number;
}

let tom: Person = {
    name: 'Tom',
    gender: 'male' // 这句就会报错，因为出现了未加定义的属性
};
```

- 任意属性

一旦定义了任意属性，那么确定属性和可选属性的类型都必须是**它的类型的子集**
```ts
interface Person {
    name: string;
    age?: number;
    [propName: string]: string;
}

let tom: Person = {
    name: 'Tom',
    age: 25, // 这句就会报错，因为不是string，即使上边定义age是number也不行
    gender: 'male',
};

interface Person {
    name: string;
    age?: number;
    [propName: string]: string | number; // 接口定义成这样使用联合类型age就不会报错了
}
```

- 只读属性

一些字段只能在创建的时候被赋值
```ts
interface Person {
    readonly id: number;
    name: string;
    age?: number;
    [propName: string]: any;
}

let tom: Person = {
    id: 89757,
    name: 'Tom',
    gender: 'male'
};

tom.id = 9527;

// index.ts(14,5): error TS2540: Cannot assign to 'id' because it is a constant or a read-only property.
```
> 注意，只读的约束存在于第一次给对象赋值的时候，而不是第一次给只读属性赋值的时候

### 数组的类型
- 「类型 + 方括号」表示法
```ts
let fibonacci: number[] = [1, 1, 2, 3, 5];
```
> 数组的项中**不允许**出现其他的类型
> 数组的一些方法的参数也会根据数组在定义时约定的类型进行限制,如果约定是`number`类型,**push**一个`string`类型就会报错

- 数组泛型
```ts
let fibonacci: Array<number> = [1, 1, 2, 3, 5];
```

- 用接口表示数组
`NumberArray` 表示：只要索引的类型是数字时，那么值的类型必须是数字。
```ts
interface NumberArray {
    [index: number]: number;
}
let fibonacci: NumberArray = [1, 1, 2, 3, 5];
```

- 类数组
类数组（Array-like Object）不是数组类型，比如 arguments：
```ts
function sum() {
    let args: {
        [index: number]: number;
        length: number;
        callee: Function;
    } = arguments;
}
```
- any 在数组中的应用
一个比较常见的做法是，用 any 表示数组中允许出现任意类型：
```ts
let list: any[] = ['xcatliu', 25, { website: 'http://xcatliu.com' }];
```
