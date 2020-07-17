---
title: 绿宝书学习笔记6
tags: [js, 基础, 绿宝书]
categories: [语言, js]
index_img: /img/green-title.png
banner_img: /img/dandelion.png
date: 2020-07-16 9:10:00
---
# 写在前边
昨天太累了，今天没能成功早起，科三第二次仍然没过，真是难受。今天就能看多少看多少吧，要尽可能补上之前落下的章节。今天是第七天，希望我能一直坚持到看完这本书，祝我们变得更强！
#### 3.2.1.2 构造复制？写时复制？还是读遍历？
假设每构造一个实例，都从原型中复制出一个实例来，新的实例占用了和原型相同的内存空间，这确实可以使`obj1 obj2`等与它们的原型“完全一致”，但是也非常的不经济——因为内存的占用会急剧增加

另一个策略来自一种欺骗系统的技术：写时复制。这种欺骗的典型示例就是操作系统中的动态链接库(DDL)，它的内存中总是写时复制的，这种机制先指明`obj1`和`obj2`与原型的引用关系，系统将这种关系理解为“两个对象都等同于它们的原型”，读的时候直接去读原型，接下来，写对象的属性的时候，我们就复制出原型的映像出来，并使以后的操作指向该映像就行了，优点是：之后第一次写的时候会用一些代码来分配内存，之后就不会有这些开销了，因为访问映像和访问原型的效率是一样的，但是对于经常读写的系统中，这种方法并不比上一种更经济

JS采用第三种方法：把写复制的粒度从整个原型变成了成员。这种方法是：仅当写某个实例的成员时，才将成员的信息复制到实例映像中。这样一来，在读取该对象的时候，仍然和上一种一样，但是在写的时候，实例会产生一个写的属性值，放在实例的成员列表中，所以现在对象仍然是一个指向原型的引用，操作过程中也没有与原型大小相同的实例被创建出来。这样写操作就很经济了，不过所有的对象实例都需要维护一张成员列表。这张成员表指向实例中发生了修改的成员名、值与类型。称为对象的**自有属性表**(own proprties)。这张表是否与原型一致并不重要，只需要遵循以下两条规则：
* 规则1：保证优先读取对象的自有属性表
* 规则2：如果在上述自有属性表中没有指定属性，则尝试遍历整个对象的原型链，知道原型为空(null)或者找到该属性

JS提供了两个方法`Object.getOwnPropertyDescriptor()`和`Object.getOwnPropertyNames()`来访问该表。而且在为某个属性置值时本质上就是在这个自有属性表中创建一项，以覆盖原型中同名的属性

那么可以推论：所谓”空白对象“，是指在它的原型链上所有的自有属性表都为空的对象。而所谓”原型链“，就是对象所有父类和祖先类的原型所形成的，可以上溯访问的链表。

#### 3.2.1.3 构造过程：从函数到构造器
上边的规则只是讲述了”怎么得到对象“，而这并不是构造的全过程，例如。我们没有解释”函数作为一个构造器，都做了什么？”

其实函数首先只是函数，即使存在`prototype`成员，但是从事指向一个标准的Object构造器的实例——空白对象，不过实例的`constructor`属性总是指向当前函数，可以理解为如下代码
```js
function asConstrucor(f) {
  return Object.assign(f, {
    prototype: {'constructor': f}
  });
}
aClass = asConstructor(new Function);
```

正常函数的`prototype`其实与一个用`new Object`创建的空白对象没有本质区别，但是但函数有了`prototype`这个属性之后，就变成了一个“构造器”。于是当用户使用`new`运算创建一个实例的时候，引擎就再构造一个对象，，并使该对象的原型链指向这个`prototype`就可以了

#### 3.2.1.4 内置属性和方法
JS对象实例本身并没有什么特别的性质，对象的行为来源于引擎对原型以及属性表的理解，例如所谓“空白对象”只不过时下边这个结构
* “原型”指向`Object.prototype`
* “属性表”指向一个空表

```js
var empty = {}

var proto = Object.getPrototyprOf(empty)
var props = Object.getOwnPropertyNames(empty)

// 显示true，原型指向Object.prototype
console.log(proto === Object.prototype);

// 显示0 属性表为空
console.log(props.length)
```
而这样的空白对象看起来更干净，是因为原型链上没有显示成员：
```js
// 续上例

// 显示非零值，表明原型链Object.prototype的属性表不是空的
var propsInChain = Object.getOwnPropertyDescriptors(Object.prototype)
console.log(Object.keys(propInChain).length)

// 显示0，表明没有显式成员
var enumerabledMembers = Object.values(propsInChain).filter(descripter => decsripter.enumerable);
console.log(enumerabledMembers)
```
进一步的推论是：所有“实例”之所以具有对象的某些属性（以及相关的对象特征），是因为它们的共同原型`Object.prototype`具有这些属性

```js
// Object.prototype的成员
Object.getOwnPropertyNames(Object.prototype)

// 构造器（函数）所具有的特殊成员
Object.getOwnPropertyNames(Function)
Object.getOwnPropertyNames(Function.prototype)

// Object作为基类的类方法
Object.getOwnPropertyNames(Object)
```

#### 3.2.1.5 原型为null，“更加空白”的对象
原型为`null`是原型继承中的特例，它有两种情况`Constructor.prototype`的值为`null`，`Object.getPrototypeOf(obj)`的值为`null`

当以函数作为构造器来使用的时候，如果它的`prototype`是非对象值或者`null`的时候，创建出来的实例其实是从`new object`创建出来的，也就是说`Object.getPrototypeOf(obj).constructor === Object`

不过有趣的是，尽管新实例不是由原型为非对象值的函数创建的，但是`new`运算仍然会把它作为this调用一次该函数

```js
Object.setPrototypeOf(obj, null);
// 它仍然是对象，但是没有继承来的任何属性(原型是null)，也不再是Object的实例
console.log(typeof obj) // 'object'
console.log('toString' in obj) // false
console.log(obj instanceof Object) // false
obj.showMe() // 能访问自有属性以及方法
```
简单的来说，这样的对象是一个只有一级（没有原型链）的属性包——只有一个自有属性表。比起空白对象，它更加空白，连Object的内置属性都没有，不过它仍然具有对象的一切性质，包括作为其他对象的原型，或者使用`Object.defineProperty()`等方法来操作它。

与直接向`Constroctor.prototype`属性设置不同，`Object.setprototypeOf()`不接受任何对象或者null值以外的值

### 3.2.2 原型链的维护
原型链：对象所有父类和祖先类原型所形成的、可上溯访问的链表

这个链表在多数情况下对于“对象实例”来说不可见

#### 3.2.2.1 外部原型链与`constructor`属性
基于传统原型继承风格实现的对象系统是这样的
```js
function MyObject() {}
function MyobjectEx() {}

// 构建外部原型链
MyObjectEx.prototype = new MyObject();

// 但是这样会导致创建的子类的实例的constructor指向了MyObjcet，所以需要显式的覆盖一下
MyobjectEx.prototype.constructor = MyObjctEx
```
> 由于覆盖了原型的constructor属性，原型与父类之间的关系，即原型链就被切断了，因此在早期的JS中，外部原型链和有效的constructor属性只能二选一

有一些框架提出了编写构造器函数的模式，可以兼二者之利
```js
function MyObject() {}
function MyObjectEx() {
  this.constructor = MyObjectEx;
  // ...
}
MyObjectEx.prototype = new MyObject()
```
这样一来`MyObjectEx`创建的实例的constructor都正确的指向`MyObjectEx`，而原型的constructor则指向`MyObject`，但是因为每次实例化都需要重写constructor所以效率很低

#### 3.2.2.2 使用内部原型链
维护一个原型链的必要性：面向对象的继承性约定：子类与父类具有相似性。为了保持这种一致性并且不被修改，（这也就是说子类必须具有父类的特性，这也是JS不能用delete删除从父类继承的成员的原因，尽管看起来像是“自有属性表”带来的特性，但是它确保了在重写成员、改变它的实现等的同时，在界面（Interface）上保持和父类的必然一致），ECMAScript约定对象实例内部必须持有该对象的原型。并且，ECMAScript还进一步规范了存取这个内部原型的标准方法`Object.getPrototypeOf()`和`object.setPrototypeOf()`

### 3.2.3 原型继承的实质
修改原型是JS中最常用的构建对象系统的方法，它的好处是可以在实例构造之后“动态地”影响到这些实例。也就是说，对象实例的特性不但可以在new运算中通过构造来得到，也可以在此后通过修改原型来持续获得

JS原型继承的实质便是对原型修改“效果的传递”。它基于以下两个事实
* 原型：原型是一个对象
* 原型链：如果子类对象没有该属性，则将访问其原型的属性表

#### 3.2.3.1 简单模型
可以修改继承树上的任意分支(类)，以使得它们的原型具有某些属性和方法。

#### 3.2.3.2 如何理解继承来的成员
在ES6种，重写操作被约定为针对自有属性表进行，因此写的结果决定于写该属性时的性质设置，而不再继承自父类，这样一来，我们就可以看到，一个在父类中不能被删除，列举且只读的成员在被重写之后，就变成了可删除，可列举和可读写的，也唯有如此，该成员的重写效果才能被清除——在删除重写的成员后，将重新沿用父类的值与性质。

## 3.3 JavaScript的类继承
早期的JS中没有类，只是使用“构造器”来实现类的某些功能，直到ES6才正式支持类，但是仍然是基于原型的——这是一种很罕见的实现模型

### 3.3.1 类是静态的声明
原型继承依赖程序的执行过程，是通过原型修改来实现继承特性的一种方法。在这种方法中，因为子类依赖父类的构造过程，所以子类必须晚于父类构造

由于JS的函数声明是早于代码的执行，所以在源代码中这样也是可行的：
```js
// 原型继承关系(语句执行是有顺序关系的)
MyObject.prototype = new Object()
MyObjectEx.prototype = new MyObject()

// 构造器函数(声明之间是没有顺序关系的)
function MyObjectEX() {
  // ...
}
```

JS的类继承，是通过类表明上述前两行的继承关系的语法，更准确的说类声明通过”声明语法“来将上述示例代码中的
* 构造器（函数）声明
* 继承关系声明

全部提前到了语法解析阶段，自此，JS的类不论是在构造方法上还是在继承关系上都没了执行顺序的限制了。

例如，一个模块中的类声明继承了另一个模块中的类，最后被同一个文件引用，是没有问题的，甚至引用顺序都无所谓，整个类继承树是由extends来决定的，各个模块之间的装载顺序并不影响继承关系的构建过程

类是静态的声明，意味着类继承关系的构建过程也是静态的，是在语法分析期就决定了的，于此相关的，这也意味着类声明语法中的方法或者属性存取器只是（对象方法的）声明，而不是函数，因此也就不能在声明内直接引用它们的名字
```js
// 使用构造器语法
function MyObject() {
  console.log(typeof MyObject)
}

// 当使用类声明时
class MyObjectEx {
  constructor() {
    // 是声明语法而并不是函数，所以constructor并不能视为函数名
    console.log(typeof constructor); // undefined
  }
  foo() {
    // 同上
    console.log(typeof foo); // undefined
  }
}
```

### 3.3.2 super是全新的语法元素
`super`是什么？它并不是一个变量或指向数据的标识符，例如，你在任何时候都不可能用`typeof super`来获取到它的类型，尽管我们知道它指向父类构造器。这是它与`this`这个关键字极大的不同之处

`super`与`new`是类似的语法元素，有两种语法
```js
// 语法1
super(arguments)

// 语法2
super.propertyName
super[expression]
```
可以使用在类声明或者字面量风格的对象声明中，仅在类声明中，它的第一种语法表明调用父类的构造方法

super在ECMA规范中并不被称为运算符，而只是被称为关键字，虽然它被放在表达式中讲述，但却在JS的语法分析阶段就是具有特殊意义的，另外虽然new被称为运算符，但是new.target的出现打破了这一认知

#### 3.3.2.1 super的使用
super的出现是为了填补原型继承的一项众所周知的不足：无法有效调用父类方法。我们曾提到过维护原型链的必要性，其中，对象实例是通过访问`obj.constructor.prototype`来访问到其原型的方法的。正是出于这个目的。维护`obj.constructor`的有效性才成为原型继承的一种”与生俱来“的负担
```js
MyObjectEx.prototype.aMathod = function () {
  var thisClass = this.contructor;
  var parentClass = thisClass.prototype.constructor;
  parentClass.prototype["aMathod"](); // 调用父类方法
}
```

#### 3.2.2.2 super指向什么
我们先来看一段代码
```js
class MyObject {
  static showMe() {
    console.log(super.toString())
  }
}
MyObject.showMe()
// class MyObject {}
```
super看上去指向了MyObject而不是它的父类Object，这是因为`super.xxx`在作为方法调用时，会隐式的传入当前方法中的`this`对象

在类的构造方法声明中，语义一：super指向父类构造器，this指向new创建的实例`super = MyObject.bind(this)`，语义二：在语法super.xxx中，super指向父类原型，在构造过程中this指向新创建的实例`super.toString = MyObject.prototype.toString.bind(this)` 

在正常的方法中同语义二

语义三：在静态类方法中使用语法super.xxx，其super指向父类，this指向调用当前方法的类(构造器函数，本例中是MyObjectEx)`super.do() => MyObject.do.bind(this)`

在静态成员的存取方法中同语义三
```js
// 字面量风格的对象声明
obj = {
  foo() {
    // 语义4；在方法声明中使用super.xxx时，super指向对象obj的原型，this指向调用本方法时的this对象
    // 相当于super.toString = Object.getPrototypeOf(obj).toString.bind(this)
    super.toString()
  },
  bar: function() {
    // 不能引用super
  }
}
```

#### 3.3.2.3 super对一般属性的意义
JS事实上允许用户代码通过`super.xxx`这一语法来引用父类中的与`xxx`同名的属性，而不仅仅是方法

```js
class MyObject{}
MyObject.prototype.x = 100

class MyObjectEx extends MyObject {
  foo() {
    console.log(super.x)
  }
}

obj = new MyObjectEx;

// 实例1
// - obj.foo() 通过super访问到的x值
obj.foo() // 100
// - obj 通过原型访问到的x值
console.log(obj.x); // 100

// 示例2
// 修改对象实例x的值
obj.x = 200;
console.log(obj.x) // 200
// 通过原型访问到的值是不变的
obj.foo() // 100

// 实例3
// 修改原型的值
MyObject.prototype.x = 300;
// 通过super访问到的值受到影响
obj.foo() // 300
// 对象的自有属性(这里是覆盖了继承属性)不受影响
console.log(obj.x) // 200
```

所谓的同名属性仍然取决于super使用的位置，例如在类静态方法中，它就指向类的原型，在字面量风格的对象中，就指向对象的原型，（而不是类.prototype）

刚刚的这句话展现了`super`引用的一个重要事实，对于任何对象实例(obj)——包括它是函数或者构造器，在其方法内引用super.xxx时
* super总是绑定在`Object.getPrototypeOf(obj)`上
* 无论将来该`foo()`函数被用来做为哪个实际对象的方法例如

```js
var proto = {data: 1}

var obj = {
  foo() {
    console.log(super.data)
  }
}
Object.setPrototypeof(obj, proto)

// obj2没有原型，那么能访问super么
obj2 = Object.create(null)
obj2.foo = obj.foo
// 由于obj.foo声明总是将super绑定到原型，所以能调用到"原型.foo”
obj2.foo() // 1
```

#### 3.3.2.4 super在两种继承关系中的矛盾
super在语义设计上同时支持了类与原型继承——类方法和对象方法中各自的原型链——所导致的矛盾。这一矛盾表现为：对象方法中缺乏一个必要的语法词汇来表示“当前对象与它在类继承链上的parent”这样的关系

注：翻译成人话就是super会越过父类直接到父类的原型上，这个时候访问父类的像静态成员就比较麻烦，所以还给了一个封装好的函数来获取父类
```js
// 对于对象me来说，得到构建他的类（父类）
function PARENT(me) {
  return Object.getPrototypeOf(me).constructor;
}
```

#### 3.3.2.5 super的动态计算过程
JS中每一个对象都有一个`[[HomeObject]]`的内部槽（Internal slots），用来在方法执行的时候找到对应的`super`，它用于保存一个在语法分析阶段确定的、声明方法时所基于的对象（对于对象方法来说就是AClass.porotype，对类静态方法是AClass）至于“找到super”则是一个使用该内部槽进行动态计算的过程

这个计算依赖一些前提假设
* 在语法分析阶段会保证`super`只出现在方法声明中
* 除箭头函数之外，其他函数（包括方法声明）都不会使用“词法this绑定”
* 并且因此，在执行环境栈中（自顶向下）找到的第一个“支持this绑定的环境”就必然对应于”当前正在执行的方法“，（执行环境栈顶部可能还有一些其他没绑定this的环境，例如语法块和with

基于此，在方法执行时，引擎就可以从环境栈中得到它的执行环境，并且：
* 得到“绑定的this”以及“对应的方法（函数）”
* 读取该方法的内部槽`[[HomeObject]]`得到它所基于的对象（例如base）；接下来
* 通过`Object.getPrototypeOf(base)`获取到super

如此一来就得到了super和this

由于构造方法中this引用是要先调用`super()`才能创建的，所以构造方法虽然也是支持this绑定的环境，并且也能得到“当前正在执行的构造方法”，但是不能在调用super之前获取到有效的this值

进一步推想就可以知道：即使如上得到了“当前正在执行的构造方法”，但是构造方法语法上是对象方法——而非类静态方法，因此它的`[[HomeObject]]`记录的是`Class.prototype`无法用于找到父类(class的super)

因此在处理“调用父类构造器”语法时，是直接将“当前构造方法”用作base，并进一步调用`Object.getPrototypeOf(base)`来获取真正的super的，换言之，它等同于从类方法中取得的`[[HomeObject]]`槽。

由于super是动态计算的并于绑定给它的内部槽相关的，所以也可以通过重置`prototype`的方式来影响`super`例如在某些情况下，甚至不需要以属性存取的方式来调用方法
```js
class MyObject extends Object {
  static getTag() {
    console.log(super.tag)
  }
}
Object.tag = "object"

MyObject.getTag() // "object"

// 重置MyObject的prototype改变super的存取
NewParent = new Function
NewParent.tag = 'function'
Object.setPrototypeOf(MyObject, NewParent)
MyObject.getTag() // 'function'

// 直接作为函数调用，super是绑定的
foo = MyObject.getTag
foo() // 'function'
```

### 3.3.3 类是用构造器（函数）来实现的
除了在语法上帮助用户维护继承关系，以及提供`super`关键字便于用户访问父类之外，从本质上说，JS的类，是用构造器（函数）实现的，和一个一般的函数并无不同
```js
class MyObject {}
console.log(typeof MyObject) // 'function'
```

当类声明中没有构造方法的时候，会自动给你创建一个构造方法，如果这个类还有继承关系，则会在构造方法中调用`super()`

所以只要是类，就总是或者隐式的存在一个对应的构造方法。因此在JS中，类作为标识符实际上就是“一个引用了该构造方法的函数”
```js
MyClass === MyClass.prototype.constructor // true
```

但是类继承和原型继承有很大的不同

在传统的原型继承中，子类的原型总是父类的一个实例，因此在子类声明中必须能够先调用父类的构造器（以创建原型），例如
```js
function MyObjectEx() {}
MyObjcetEx.prototype = new MyObject();
```

而JS在类继承中并不通过如上的动态过程来构造原型链，而是简单的执行重置了原型的原型，如下
```js
class MyObjctEx extends MyObject {}

// 声明一个构造器
function MyObjctEx() {}

// 置原型的原型
Object.setPrototypeOf(MyObjctEx.prototype, MyObjct.prototype)

// 注：MyObjctEx.prototype.constructor 是自有属性，不需要再重写

// 置类的原型
Object.setPrototypeOf(MyObjctEx, MyObjct)
```

> 这里我没太搞懂啊，先置原型的原型理解了，但是又置类的原型不会把之前置原型的原型给覆盖掉么，但是用代码测试一下，并没有区别，，这里搞得很懵

> 研究了将近一个点，我的理解是，应该先置类的原型，再置原型的原型，这样才能正常继承，头大

置类的原型之后super才可以为类静态声明找到它们的父类

接下来，我们进一步考察`new`运算符在传统的原型继承成的使用，例如：
```js
// 如果要用原型继承方式调用父类方法，则需要维护原型链，并持有父类的构造器(例如base)
function MyObjctEx() {
  base.call(this)
  this.aMathod = function () {
    base.prototype.aMathod.call(this);
    // ...
  }
  // ...
} 
var obj = new MyObjctEx();
```
在该实例中，则需要注意，在调用`base.call()`时的this实例就是存在的，这个this实例：
* 实际上时使用MyObjctEx()构造器创建的，并且将以该实例作为this引用，
* 从MyObjctEx()开始并上溯至基类，将每个构造器当作函数来使用

于此不同，对类来说，new运算符将使用它的基类来构造实例，更准确的说，new运算符将回溯它的继承链并使用顶端的原生构造器开构造实例，这个过程类似于
```js
// 本例是如下代码的模拟效果
new MyObjectEx();

// 模拟类继承中this对象的创建和使用
var thisObj = new Object;
MyObjct.call(thisObj);
MyObjctEx.call(thisObj);
```
因此类中的this实例：
* 实际上是使用Objct()构造器创建的，并且(使用它作为this引用)
* 调用构造器，该调用是顺序的，从基类开始一直到MyObjctEx()

这样一来这个顺序与上例中的原型继承正好相反，由此带来了一项著名的限制：
* 在类的构造方法中，不能在调用super之前使用this

显然，必须让所有的构造方法都得先调用super以回溯整个原型链。才能确保基类最先创建实例。这也是没有在类中声明`constructor`方法时，JS会默认添加一个构造函数，并在其中调用super的原因，更确切地说，如果子类是派生的，那么他就必须得在构造函数中调用super。而非派生类，就不能调用super

在非派生类的构造方法中，this对象是在进入该构造方法之前由引擎创建好了的(因此不用在构造函数中调用super)，并且在构造函数中可以返回一个对象来代替这个默认的this对象，这沿袭了JS一项历史悠远的传统设计，new运算会为构造器创建一个对象作为this引用，并调用该函数，且允许在函数中返回对象来替换默认的this对象

最后，在任何时候我们都能混用两种继承风格：
```js
function MyObjectEx() {}
MyObjectEx.prototype = new MyObject;
MyObjectEx.prototype.constructor = MyObjctEx

class MyObjectEx2 extends MyObjcetEx {

}
```

### 3.3.4 父类的默认值与null值
如果没有写父类，那么默认就是`Object`作为父类，以下两种写法等价
```js
class MyObject1{}
// 不能使用 super
class MyObject2 extends Objcet {}
// 必须调用super()
```
如果父类是null，那么该类不能实例化，由于不能调用super()，所以也不能使用this，super.xxx()需要绑定this也不能使用，super.xxx事实上不能访问到有效成员，也不能使用

这种类就变成了纯静态类，只有类方法有意义

## 3.4 JavaScript的对象系统
所谓“对象系统”就是“一组对象构成的系统”。这些对象之间存在或者不存在某种联系，但是总之是通过一些规则组织起来的。若以这样一个对象系统为基础来衍生演化，且其新系统仍能满足这些组织规则的话，整个系统即是所谓的“面向对象的系统”

### 3.4.1 封装和多态
对象系统还包括其他两个方面的要素（即组织规则）：封装和多态。它们通常和继承一起，称为对象系统的三要素

#### 3.4.1.1 封装
封装表达为`private、protected`等关键字限定的成员存取范围或作用域，以及对象在不用继承层次上对成员的叠加

JS依赖变量作用域来实现封装特性，所以相当于只实现了`pubic`和`protected`

#### 4.3.1.2 多态
多态性表现在两个方面：类型的模糊与类型的确认（或者识别）。在一些高级语言中，它们分别被表达为`as`和`is`这两个关键词或运算

对象的多态性被转换为运行期的动态特性——例如可以动态的添加对象的方法或者成员，使它看起来像是某个对象

由于所有对象的typeof的值都是object，所以在系统需要确知对象具体类型时，应当使用`instanceof` 运算来进一步检测对象类型的检查，它等效于其他高级语言的`is`运算，但是当两个函数当作一般对象参与运算时，instanceof就失效了，需要使用`isPrototypeOf`
```js
// 直接置f2的原型链
var f1 = new Function, f2 = new Function
Object.setPrototypeOf(f2, f1)

// 检测不到f1与f2之间的原型关系
console.log(f2 instanceof f1) // false

// 使用isPrototypeOf检测
console.log(f1.isPrototypeOf(f2)) // true
```
同理，类之间也得使用`isPrototypeOf`

#### 3.4.1.3 多态与方法继承
多态性中的另一个关键问题是，在类型继承中识别父类的同名方法，使用super关键字即可

### 3.4.2 属性
一些讨论对象系统的书籍会将属性、方法、事件（properties、Methods、Events，PME）作为对象系统完整的外在表现来讨论，在本节中“方法”是特指函数类型的属性，在这种情况下：方法是属性的一个子集，有对象成员的全部特性
#### 3.4.2.1 方法
方法就是函数类型的属性，除了null值，所有JS的对象都能操作自己的属性表，在对象的自有属性表维护的方法称为对象方法，而在Constructor.prototype这个对象上维护的方法，是那些用`new Constructor()`所创建的实例的原型方法，原型方法是所有实例通过原型继承来共享使用的——相同父类的实例调用的原型方法是用一个函数

对象通过重写对象方法可以来覆盖继承的原型方法，这与重写一般属性没有什么区别，因此也可以使用`Objcet.defineproperty()`等来创建这些方法。当方法被重写之后，也可以使用`Object.getOwnPropertyDescriptor()`来获取它的描述符

当一个函数在调用过程中获取到的this值为undefined或者null，则在严格模式下，仍以此作为this，其他模式就把全局对象作为this值

#### 3.4.2.2 事件
大多数高级语言并没有事件系统，在这种情况下，事件是对象系统实现时由应用框架提供的额外机制，而非对象系统的必然要求

JS的事件也是外来户，JS本身并没有事件，我们经常在浏览器使用的Onload、Onclick等事件，其实是DOM——一个由宿主供应与维护的可编程对象模型提供的

尽管大多数时候我们在写事件的响应函数，或者面向事件响应来架构系统，但是事件却不是ECMAScript或者JS语言的一个组成部分
