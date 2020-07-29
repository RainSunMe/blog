---
title: 绿宝书学习笔记8
tags: [js, 基础, 绿宝书]
categories: [语言, js]
index_img: /img/green-title.png
banner_img: /img/dandelion.png
date: 2020-07-19 08:00:00
---
## 3.6 运行期侵入和元编程系统
到现在为止，我们将JS中有关面向对象编程的一切都放在原型继承的体系下来讨论，这一体系的基本特点是：属性就是一切，继承的本质就是对自有属性表的管理

但接下来不同，JS提供了多种混乱且杂糅的技术，允许开发人员在运行期侵入对象，具备了影响几乎所有对象相关运算符和语句的能力。这些手段渐渐称为了一个全新的技术内核，从而使元编程在JS语言中若隐若现

### 3.6.1 关于运行期侵入
早起的JS并没有提供运行期侵入的语法特性，有一些看起来类似的特性，也渐渐被识别出来并归类到动态语言特性中去了，例如`valueOf()`和`toString()`带来的动态类型特性，最早真正用于运行期侵入的是一个一直一来都未被规范的语法元素：对象的`__proto__`属性，它可以让开发人员直接操作（包括重写）对象的原型，进而影响instanceof运算符。

`__proto__`属性反映了我们了解和影响JS内部运行逻辑的迫切需求，有些语言机制在不引入“内部属性”这一个概念的时候是很难讲清楚的，这些内部属性通常记作`[[internalPropertyName]]`。我们在前面的叙述中用到过三种内部属性，包括：
* [[HomeObject]]: 方法的主对象
* [[Namespace]]: 名字空间对象
* [[Extensible]]: 可扩展标记

#### 3.6.1.1 运行期侵入的核心机制
对象在JS内部被描述为具有一些**“内部槽”**的结构体，操作这个结构体的方法被称为**“内部方法”**，并且基于此提供了处理对象各种行为的确定逻辑，然后JS对外公布了使用这些内部槽和内部方法的一组界面，从而赋予了开发人员侵入运行期（的处理逻辑）的能力

就目前来说，适用于基本对象的内部方法一共有11个，另外，适用于函数的内部方法有两个，这也就是JS的反射机制(Reflect和Proxy类)只有13个方法的原因，其中`Reflect`对象提供直接调用这些内部方法的能力、而Proxy则在这些内部方法外包裹了一层拦截器，以影响那些内部行为

基本对象的内部槽有且仅有两个，分别是[[prototype]]和[[Extensible]]。对象还持有一个自有属性表，当[[Extensible]]为true时，表明这个表可以增删和修改，当访问属性时。如果在自有属性表没找到指定属性，且[[prototype]]为非null值就表明可以上溯到该原型对象的自有属性表查找，直接操作这两个槽的方法有4个

| 内部槽 | 操作 | 行为 |
| :--: | :--: | :--: |
| [[prototype]] | Object.getPrototypeOf(obj) |  取obj的[[prototype]]值 |
| [[prototype]] | Object.setPrototypeOf(obj) |  置obj的[[prototype]]值 |
| [[Extensible]] | Object.isExtensible(obj) | 取obj的[[Extensible]]值 |
| [[Extensible]] | Object.preventExtensions(obj) | 置obj的[[Extensible]]值 |

函数也会多出来两个内部槽[[Realm]]和[[ScriptOrModule]],[[Realm]]是指这个函数对象所在的区域（可以看作可执行环境的一个静态映像），而[[ScriptOrModule]]则指向初始化该函数的结构：脚本快、模块或者null(例如它是动态创建的)。但是JS并不提供任何直接访问函数对象的这些内部槽的任何方法，除此之外，它作为一个对象，即理解为`Function`类的一个实例，就和普通对象没有什么不同了。

#### 3.6.1.2 可被符号影响的行为
JS公布了一组面向内部机制的的**符号属性**，以访问这些**内部槽**。符号所指代的属性是被声明在对象的属性表中的，而并不是上述的内部槽。通过符号属性来影响内部机制的方法存在很大的局限性，并且与后边要将到的反射机制迥然不同

##### Symbol.toStringTag
仅对原生的objct.prototype.toString方法有效，如果子类覆盖了该方法，则新方法未必会读取该属性
```js
var obj = {
  [Symbol.toStringTag]: 'something'
};
console.log(obj.toString()); // [object something]
```
##### Symbol.toPrimitive
toPrimitive指向的函数需要将target对象转换为值数据的情况下就会被调用，例如`'1' + target`其界面的hint值用于表明试图转换为值的类型，包括'number'、'string'或使用'default'表示上述二者之一（皆可）
```js
var obj = {
  [Symbol.toPrimitive](hint) {
    if(hint == 'number') return NaN;
    return 'invalid'
  }
}
console.log(''+obj) // 'invalid'
console.log(+obj) // NaN
```
##### Symbol.hasInstance
hasInstance指向一个函数，在使用` obj instanceof target`这样的语法时，才会由引擎去访问，调用该函数并以其返回值作为运算的结果。并且事实上，JS中的`Function.prototype`就默认有一个这样的属性，所以我们总是可以对所有函数使用instanceof运算

##### Symbol.unscopables
unscopables指向一个对象，该对象的每一个属性指明是否从`with`闭包中强制排除对应的`target.xxx`属性，这是因为`with(target)`语句在试图将属性名作为名字访问——需要用过`[[get]]`行为去访问target的指定属性——之前会用查表得方式查询`unscopables`对象
```js
var f = new Function;
var constructor = null; // 在with之外得标识符

// 会访问f.prototype.constructor
with(f.prototype) console.log(f === constructor); // true

// 排除
f.prototype[Symbol.unscopables] = {constructor: true};

// 会访问with外的标识符
with(f.prototype) console.log(f === constructor); // false
```

##### Symbol.isConcatSpreadable
isConcatSpreadable是一个布尔值，仅当target是一个数组或者类数组的集合对象并且试图使用`concat`来链接它时才有意义，值为true时就一个一个链接进入，为false就把当前数组作为一个整体放进去

##### Symbol.match Symbol.replace Symbol.search Symbol.split
这四个符号都指向函数，如果目标对象使用了其中之一，那么会使对应的字符串操作收到响应的影响，以`str.split()`为例，假设我们要用一个一般对象（作为目标对象）来分隔字符串，那么只需要为它的Symbol.split为名字的属性设置一个分隔方法就可以了
```js
var s = {}

s[Symbol.split] = function(str, limit) {
  return str.split(' ' , limit)
}
var str = 'hello world'
console.log(str.split(separator));

// 或者
class S {
  [Symbol.split](str, limit) {
    return str.split(this.separator || ' ', limit)
  }
}
var tor = new S();
console.log('hello world'.split(tor))

tor.separator = ','

console.log('hello,world'.split(tor))
```

这也是为什么split的第一个参数可以是正则表达式的原因

```js
console.log((new regExp)[Symbol.split])
// [Function: [Symbol.split]]
```

当obj[Symbol.match]不是一个undefined值，并且可以转换为布尔值true时，JS会尝试将对象理解为一个正则表达式，如果出问题就会报错

##### Symbol.species
最后需要特别指出的是`species`符号，它指向一个构造器函数，主要影响JS内部隐式创建对象的行为，例如使用如下代码时
```js
var newArray = arr.slice(0, 2);
```
就会产生一个新的Array()对象，并且将在隐式创建这个新对象时访问属性
```js
arr.constructor[Symbol.species]
```
来决定使用哪个构造器。

#### 3.6.1.3 内部方法与反射机制
对象可以用自己的处理过程来覆盖内部方法，这称为自有内部方法。JS在调用内部方法时，会优先使用对象自有的方法。JS许多内建的对象许多都是这样的，当这些内建对象的构造器创建一个实例时邮寄换传入一张表，来覆盖内部方法。

其中反射机制中的Proxy对象提供了覆盖全部十三种内部方法的能力，从而实现了对任意对象的侵入。一个代理对象（Proxy）可以代理一个目标对象的全部行为，并通过在助手对象`handler`上的陷阱来响应”在代理对象上发生的“指定行为。代理对象就好像在拦截目标对象之前的防火墙

JS并不直接调用`handler.xxx`这样的陷阱方法，而是调用Proxy()实例的自有内部方法，并由后者来决定如何使用陷阱方法，对于proxy对象的自有内部方法，它们都有着基本相同的逻辑

虽然Proxy的侵入路径很好，但是也会出现一些问题

问题一：部分JS内部检测会绕过代理，譬如new运算会检测目标函数是否是构造器，这是通过检查其[[constructor]]内部方法槽是否有值来实现的，即使在Proxy里边设置了代理，但是仍然会被绕过导致某些情况下的错误，例如代理的对象是箭头函数

问题二：这些方法内部也是互相调用的，并非原子操作，进而带来了递归调用的可能，会破坏系统的稳定性

非原子操作：`[[DefineOwnProperty]]` `[[Delete]]` `[[HasProperty]]` `[[Get]]` `[[Set]]`

#### 3.6.1.4 侵入原型
Object是JS对象系统的基类，然而我们并不能重置它的原型，这是ECMA规范对Object.prototype的一点限制，确保它总是由宿主或者脚本引擎来进行初始化。且一旦初始化之后，就不可已被改变（非可变原型）具体的做法就是让Object.prototype的自有内部方法[[SetPrototypeOf]]指向一个特定的逻辑：
* 如果置值等有既有的值，返回true
* 置初值之外的任何值，均返回false

处于同样的原因，JS也将Object.prototype属性的性质设置为不可写和不可重置

所以对于Object及其子类，只剩下一种侵入方法：拓展Object.prototype属性（包括添加和更新），从而影响所有以它为祖先类的子类和子类实例。也是利用JS的原型继承特性进行侵入的、原生的、传统的手段：
```js
function MyObject() {}

var obj = new Object;

var obj2 = new MyObject;

console.log(Object.isExtensible(Object.prototype)); // true

// 拓展Object.prototype
Object.prototype.x = 100;
console.log(obj.x) // 100
console.log(obj2.x) // 100
```

当然也可以给Object.prototype添加前边所讲述的符号属性，例如使用Symbol.iterator来让所有对象都可迭代

这显然不够。事实上我们可以做的更多——只是这样的操作不能在Object.prototype上做罢了。比如侵入它的子类的一个原型，我们有机会在子类和基类之间插入一个代理，从而完全透明的侵入这个子类
```js
function intrudeOnPrototype(Class, handler) {
  var orginal = Object.getPrototypeOf(Class.prototype);
  var target = Object.create(orginal)
  var {proxy, revoke} = Proxy.revocable(target, handler);
  Object.setPrototypeOf(Class.prototype, proxy)
  return () => revoke(Object.setPrototypeOf(Class.prototype, orginal))
}

var str = new String('OldString');
var recovery = intrudeOnPrototype(String,{
  get: function(target, prop) {
    if(prop == 't') return 100;
    return Reflect.get(...arguments);
  }
});
var str2 = new String('NewString');

// 原型没有变化
console.log(Object.getPrototypeOf(str) == Object.getPrototype(str2));  // true
console.log(str.t) // 100
console.log(str2.t) // 100

// Object没有受到影响
console.log((new Object).t) // undefined

// 重置
recovery();
console.log(str.t) // undefined
console.log(str2.t) // undefined
```
在这个例子中，我们需要注意到一个事实，String.prototype的原型就是Object.prototype

所以关键在于第二行得到的orginal变量，也就是Object.prototype在代码全程没有被修改，而且在第四行代码中，revecable()创建代理其实是以orginal为原型的实例target——所以事实上也没有修改String.prototype，却完成了侵入，更进一步可以针对target来使用其他的侵入手段，也是安全的，可撤销的

### 3.6.2 类类型与元类继承
运行期侵入只是元编程的冰山一角。事实上，深入理解语言机制，可以让我们在更多方面进行拓展，例如构建自己的对象系统或者自己的继承体系，这其中就包括在JS中没有显式支持的元类和元类继承

这里所说的类（class），是指用class关键字声明的类，包括静态类和类表达式

而所谓的元类（meta class），是指能产生类的类

#### 3.6.2.1 原子
最小颗粒度的运算对象显然是值，包括undefined、boolean、string、number和Symbol。它们都是ECMA所约定的原始值。但如果只考虑JS的对象系统，那么它的原子就是`Object.create(null)`

这种atom对象具有一般对象的全部性质，也适用于所有对象的操作或运算；它比空白对象更原始，却又不像null一样表示对象类型中的“无值”，并且，atom对象是不受Object.prototype影响的，因为它甚至都不是Object实例
```js
type atom // 'object'
atom instanceof Object // false
```
那么最小粒度的类又是什么样子的呢？显然，它应该是以atom为原型的类：
```js
var Atom = new Function
Object.setPrototypeOf(Atom.prototype, null)
```
原子类仍然不是元类，这个原子类构造出来的仍然是对象实例——这些实例与上例中的atom有相同的性质，这也意味着我们有三种方式来得到atom实例：
```js
// 方法一
var atom = Object.create(null)

// 将任意对象的原型置为null
var atom = Object.setPrototypeOf(new Object, null)

// 方法三实例的原型不是null而是另一个atom
var atom = new Atom;
```

#### 3.6.2.2 元与元类
现在让我们来考虑元类的问题，由于类是函数（构造器），因此所谓元类必须是能“产生函数的函数”，基于这一定义，可以这样来得到它：
```js
class Meta extends Function {
  // ...
}
```
这的确是可行的，但是我们考虑到元类本身也应当是一个原子，并且——如同在概念上所定义的——它应该能产生一个类，所以更高的处理方法是这样的
```js
// 元（元语言、元编程体系的基类型 v1.0）
class Meta extends null {
  constructor() {
    return Object.setPrototypeOf(class extends null{
      constructor() {
        return Object.create(new.target.prototype);
      }
    }, new.target)
  }
}
```
那么Meta和Atom的关系是什么？

留意第四行代码中的一个类表达式（字面量风格声明的值），是一个父类为null，匿名的类，它实际与前面的原子构造器有相同的语义和相同的效果

因为Meta的构造方法返回的实例就是这样的一个类表达式，即原子函数，即Atom。所以 ，我们也就得到了Atom（原子构造器、原子类）的第二种声明方式：
```js
// 原子类
var Atom = new Meta;
```

考虑到要将Meta作为元编程的原子模型，它自己也必须是最小粒度的，因此它的原型也是Atom。
```js
Object.setPrototypeOf(Meta, null)
```

于是我们就有了两个继承体系，一个是以Atom为基类的对象继承系统，另一个是以Meta为基类的类继承系统，为了和JS已有的构造器名字有所区别
```js
// 元类
// 仅用于建立一层抽象语义
class MetaClass extends Meta {}
// 元对象（类）
// 隐含的声明了MetaObject拓展自Atom类
class MetaObject extends new MetaClass {}
```
注意在这两个声明中，MetaClass只是对Meta的一个简单继承，用于建立一层抽象概念上的子模型。因此new MetaClass 和new Meta的结果实际上是一样的，只有语义上有区别

因此。事实上MetaObject就是Atom的子类

#### 3.6.2.3 类类型系统
我们说MetaObject是Atom的子类，即MetaClass的实例，然而下边的结果和我们的预期相反
```js
MetaObject instanceof MetaClass // false
```

问题出在运算符instanceof的一项约定，当它的右操作数是一个函数时，则使用该函数的.prototype来检查原型链，因为在这个表达式中，函数指代的是类（构造器），它之于对象实例的原型是Constructor.prototype（而不是构造器自身）

之前我们讲到过可以通过Symbol.hasInstance来实现：对象构建自对象这样的语义，同样我们也可以用这个符号来实现：函数构建自函数
```js
class Meta extends null {
  constructor() {
    return Object.setPrototypeOf(class extends null{
      constructor() {
        return Object.create(new.target.prototype);
      }
      // 使instanceof恢复到默认
      static [Symbol.hasInstance](obj) {
        return Object.prototype.isPrototypeOf.call(this.prototype, obj);
      }
    }, new.target)
  }
  // 让元及其子类在instanceof运算中以自身作为操作数
  static [Symbol.hasInstance](obj) {
    return Object.prototype.isPrototypeOf.call(this, obj);
  }
}

Object.setPrototypeOf(Meta, null);
class MetaClass extends Meta {}
class MetaObject extends MetaClass {}
```

于是我们得到了一个对JS元编程的全新拓展，即所谓的“类类型系统”，主要用于定义类以及操作类的类型信息。由于它是指从MetaClass开始拓展的类型系统，因此也可以称为“元类类型系统”。现在在这个系统中，我们已经可以开始创建第一个对象了：它是一个简单的、所谓更加空白的对象，没有任何自有属性
```js
MetaObject instanceof MetaClass // true

MetaClass instanceof Meta // true

// 对象
var obj = new MetaObject
obj instanceof MetaObject // true

// obj不是Object()或其子类的实例
obj instanceof Object // false

// obj 是对象
typeof obj // 'object'
```

#### 3.6.2.4 类类型的检查

新的类类型系统不尽带来了它的最终产物“原子对象”，还带来了一个新的概念：类类型。这在本质上是对类的衍生和系统化做出了另一种规范：在旧式的类继承中。类是由父类拓展而来的，而在类类型的体系中，类是由类类型创建出来的

> 已经看不懂了，不浪费时间了，找时间看完元类型再继续回来看
