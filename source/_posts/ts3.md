---
title: TypeScript学习笔记（高级篇
tags: [ts, 高级1, 每日一更]
categories: [语言, ts]
index_img: /img/ts.jpg
banner_img: /img/ts.jpg
date: 2020-04-06 11:25:00
---
# TypeScript高级
[TypeScript入门教程](https://ts.xcatliu.com)
## 写在前边
这只是一个笔记，并不是教程，阮一峰大佬写的教程链接在上边
## 类型别名
类型别名用来给一个类型起个新名字。
```ts
type Name = string;
type NameResolver = () => string;
type NameOrResolver = Name | NameResolver;
function getName(n: NameOrResolver): Name {
    if (typeof n === 'string') {
        return n;
    } else {
        return n();
    }
}
```
上例中，我们使用 `type` 创建类型别名。

> 类型别名常用于联合类型。

## 字符串字面量类型
字符串字面量类型用来约束取值只能是某几个字符串中的一个。
```ts
type EventNames = 'click' | 'scroll' | 'mousemove';
function handleEvent(ele: Element, event: EventNames) {
    // do something
}

handleEvent(document.getElementById('hello'), 'scroll');  // 没问题
handleEvent(document.getElementById('world'), 'dbclick'); // 报错，event 不能为 'dbclick'

// index.ts(7,47): error TS2345: Argument of type '"dbclick"' is not assignable to parameter of type 'EventNames'.
```
> 注意，类型别名与字符串字面量类型都是使用 `type` 进行定义。

## 元组
定义一对值分别为 `string` 和 `number` 的元组
```ts
let tom: [string, number] = ['Tom', 25];

let tom2: [string, number]
tom2[0] = 'Tom'  // 直接赋值会在node和浏览器中报错，但是ts不会报错
tom2[1] = 1 // 可以对它赋值，也可以不赋值，不会报错
tom2[1] = 'tox' // 这个地方就会报错，因为指定了是number

tom2 = ['Tom'] // 会报错，因为整体赋值必须要符合定义

tom2.push('d') // 新加入得元素只要符合
tom2.push(1)

let tom3: any = [] // 经测试正常还是用这个把
```
## 枚举
枚举（Enum）类型用于取值被限定在一定范围内的场景，比如一周只能有七天，颜色限定为红绿蓝等。
```ts
enum Days {Sun, Mon, Tue, Wed, Thu, Fri, Sat};
```
枚举成员会被赋值为从 0 开始递增的数字，同时也会对枚举值到枚举名进行反向映射：
```ts
enum Days {Sun, Mon, Tue, Wed, Thu, Fri, Sat};

console.log(Days["Sun"] === 0); // true
console.log(Days["Mon"] === 1); // true
console.log(Days["Tue"] === 2); // true
console.log(Days["Sat"] === 6); // true

console.log(Days[0] === "Sun"); // true
console.log(Days[1] === "Mon"); // true
console.log(Days[2] === "Tue"); // true
console.log(Days[6] === "Sat"); // true

// 会被编译为
var Days;
(function (Days) {
    Days[Days["Sun"] = 0] = "Sun";
    Days[Days["Mon"] = 1] = "Mon";
    Days[Days["Tue"] = 2] = "Tue";
    Days[Days["Wed"] = 3] = "Wed";
    Days[Days["Thu"] = 4] = "Thu";
    Days[Days["Fri"] = 5] = "Fri";
    Days[Days["Sat"] = 6] = "Sat";
})(Days || (Days = {}));
```

**手动赋值**
```ts
enum Days {Sun = 7, Mon = 1, Tue, Wed, Thu, Fri, Sat};

console.log(Days["Sun"] === 7); // true
console.log(Days["Mon"] === 1); // true
console.log(Days["Tue"] === 2); // true
console.log(Days["Sat"] === 6); // true
```
> 如果未手动赋值的枚举项与手动赋值的重复了，TypeScript 是不会察觉到这一点的，小心被覆盖
> 当然，手动赋值的枚举项也可以为小数或负数，此时后续未手动赋值的项的递增步长仍为 1

手动赋值的枚举项可以不是数字，此时需要使用类型断言来让 tsc 无视类型检查 (编译出的 js 仍然是可用的)
```ts
enum Days {Sun = 7, Mon, Tue, Wed, Thu, Fri, Sat = <any>"S"};
```
前面我们所举的例子都是常数项，一个典型的计算所得项的例子：
```ts
enum Color {Red, Green, Blue = "blue".length};  // "blue".length 就是一个计算所得项。
```
上面的例子不会报错，但是**如果紧接在计算所得项后面的是未手动赋值的项**，那么它就会因为无法获得初始值而报错

**常数枚举**

常数枚举是使用 `const enum` 定义的枚举类型

常数枚举与普通枚举的区别是，它会在编译阶段被删除，并且不能包含计算成员。

**外部枚举**

是使用 `declare enum` 定义的枚举类型
> 同时使用 declare 和 const 也是可以的

## 类
**TypeScript** 除了实现了所有 ES6 中的类的功能以外，还添加了一些新的用法。

**TypeScript** 可以使用三种访问修饰符（Access Modifiers），分别是 `public、private` 和 `protected`。

当构造函数修饰为 `private` 时，该类不允许被继承或者实例化

当构造函数修饰为 `protected` 时，该类只允许被继承

### 参数属性
修饰符和`readonly`还可以使用在构造函数参数中，等同于类中定义该属性同时给该属性赋值，使代码更简洁
```ts
class Animal {
    // public name: string;
    public constructor (public name) {
        // this.name = name;
    }
}

class Animal {
    readonly name;
    public constructor(name) {
        this.name = name;
    }
}
a.name = 'Tom'; //会报错
```
> 注意如果 `readonly` 和其他访问修饰符同时存在的话，需要写在其后面

### 抽象类
`abstract` 用于定义抽象类和其中的抽象方法

首先，抽象类是不允许被实例化的

其次，抽象类中的抽象方法必须被子类实现

```ts
abstract class Animal {
    public name;
    public constructor(name) {
        this.name = name;
    }
    public abstract sayHi();
}

class Cat extends Animal {
    public sayHi() {
        console.log(`Hello`);
    }
}
let animal =  new Animal('dd') // 会报错，抽象类不能被实例化
let cat = new Cat('dd')  // ok
```
> 需要注意的是，即使是抽象方法，TypeScript 的编译结果中，仍然会存在这个类

### 类的类型
给类加上 TypeScript 的类型很简单，与接口类似
```ts
class Animal {
    name: string;
    constructor(name: string) {
        this.name = name;
    }
    sayHi(): string {
      return `My name is ${this.name}`;
    }
}

let a: Animal = new Animal('Jack');
console.log(a.sayHi()); // My name is Jack
```
## 类与接口
接口（Interfaces）可以用于对「对象的形状（Shape）」进行描述。

这一章主要介绍接口的另一个用途，对类的一部分行为进行抽象。
### 类实现接口
实现（`implements`）是面向对象中的一个重要概念。一般来讲，一个类只能继承自另一个类，有时候不同类之间可以有一些共有的特性，这时候就可以把特性提取成接口（interfaces），用 `implements` 关键字来实现。这个特性大大提高了面向对象的灵活性。

举例来说，门是一个类，防盗门是门的子类。如果防盗门有一个报警器的功能，我们可以简单的给防盗门添加一个报警方法。这时候如果有另一个类，车，也有报警器的功能，就可以考虑把报警器提取出来，作为一个接口，防盗门和车都去实现它

一个类可以实现多个接口

```ts
interface Alarm {
    alert(): void;
}
interface Light {
    lightOn(): void;
    lightOff(): void;
}

class Door {
}

class SecurityDoor extends Door implements Alarm {
    alert() {
        console.log('SecurityDoor alert');
    }
}

class Car implements Alarm, Light {
    alert() {
        console.log('Car alert');
    }
    lightOn() {
        console.log('Car light on');
    }
    lightOff() {
        console.log('Car light off');
    }
}
```

### 接口继承接口
```ts
interface Alarm {
    alert(): void;
}

interface LightableAlarm extends Alarm {
    lightOn(): void;
    lightOff(): void;
}
```
### 接口继承类
```ts
class Point {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

interface Point3d extends Point {
    z: number;
}

let point3d: Point3d = {x: 1, y: 2, z: 3};
```
## 泛型
泛型（Generics）是指在定义函数、接口或类的时候，不预先指定具体的类型，而在使用的时候再指定类型的一种特性。
```ts
function createArray(length: number, value: any): Array<any> {
    let result = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}

createArray(3, 'x'); // ['x', 'x', 'x']

function createArray<T>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}

createArray<string>(3, 'x'); // ['x', 'x', 'x']
```
### 多个类型参数
```ts
function swap<T, U>(tuple: [T, U]): [U, T] {
    return [tuple[1], tuple[0]];
}

swap([7, 'seven']); // ['seven', 7]
```
### 泛型约束
在函数内部使用泛型变量的时候，由于事先不知道它是哪种类型，所以不能随意的操作它的属性或方法
```ts
interface Lengthwise {
    length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);
    return arg;
}
```
上例中，我们使用了 extends 约束了泛型 T 必须符合接口 Lengthwise 的形状，也就是必须包含 length 属性。

此时如果调用 loggingIdentity 的时候，传入的 arg 不包含 length，那么在编译阶段就会报错了

多个类型参数之间也可以互相约束
```ts
function copyFields<T extends U, U>(target: T, source: U): T {
    for (let id in source) {
        target[id] = (<T>source)[id];
    }
    return target;
}

let x = { a: 1, b: 2, c: 3, d: 4 };

copyFields(x, { b: 10, d: 20 });
```
上例中，我们使用了两个类型参数，其中要求 T 继承 U，这样就保证了 U 上不会出现 T 中不存在的字段

### 泛型接口

```ts
interface CreateArrayFunc<T> {
    (length: number, value: T): Array<T>;
}

let createArray: CreateArrayFunc<any>;
createArray = function<T>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}

createArray(3, 'x'); // ['x', 'x', 'x']
```
### 泛型参数的默认类型
在 TypeScript 2.3 以后，我们可以为泛型中的类型参数指定默认类型。当使用泛型时没有在代码中直接指定类型参数，从实际值参数中也无法推测出时，这个默认类型就会起作用。
```ts
function createArray<T = string>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}
```
## 声明的合并
如果定义了两个相同名字的函数、接口或类，那么它们会合并成一个类型

### 函数的合并
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

### 接口的合并
```ts
interface Alarm {
    price: number;
}
interface Alarm {
    weight: number;
}
// 相当于
interface Alarm {
    price: number;
    weight: number;
}
```
> 合并的属性的类型必须是唯一的

接口中方法的合并，与函数的合并一样
```ts
interface Alarm {
    price: number;
    alert(s: string): string;
}
interface Alarm {
    weight: number;
    alert(s: string, n: number): string;
}

// 相当于
interface Alarm {
    price: number;
    weight: number;
    alert(s: string): string;
    alert(s: string, n: number): string;
}
```
## 拓展阅读
[索引链接](https://ts.xcatliu.com/advanced/further-reading)