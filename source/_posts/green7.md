---
title: 绿宝书学习笔记7
tags: [js, 基础, 绿宝书]
categories: [语言, js]
index_img: /img/green-title.png
banner_img: /img/dandelion.png
date: 2020-07-17 08:00:00
---
### 3.4.3 构造对象系统的方法
JS的原型继承并不是唯一构造系统的方法，由语言提供的、原生支持的方法还包括类抄写、类继承、以及直接创建对象等，其他可以在ECMAScript语言基础上拓展的方法包括元继承、元类继承等
#### 3.4.3.1 类抄写
子类的构造逻辑：先向父类传入this引用以抄写父类方法，再向子类传入this引用抄写子类方法，后者覆盖前者的同名成员。整个构造过程都是在不断的从“类构造器”向this引用抄写成员，所以被称为类抄写

这种方法也有好处。由于这种方法是通过不断修改实例（this）的成员来得到对象的，因此所有的属性都在实例（this）的自有属性表中，进一步的推论是访问任何成员都不必回溯原型链，因而效率更高

类抄写的第二个问题是系统并不维护原型继承链。因此在类抄写构建的系统中，不能用`instanceof`来检测继承关系

#### 3.4.3.2 原型继承
存在缺陷；
* 在维护构造器引用和外部原型链之间无法平衡
* 没有提供调用父类方法的机制
  
还是一个典型的时间换空间的方案：继承层次中临近的成员访问更快，而试图访问一个不存在的成员耗时最久

#### 3.4.3.3 类继承

类继承是对原型继承的增强，也是一种再实现

从纯粹概念上说，“原型也是对象实例”是一个极为关键的性质，这是它与类继承体系本质上的不同，对于类继承来说，类不必是对象，因此类也不必具有对象的性质，类可以是一个内存块，也可以是一段描述文本，而不必是一个有对象特性的结构

* 类的实例是创建自基类的
* 类构造方法的调用顺序是逆向的

#### 3.4.3.4 直接创建对象
脱离传统的new运算直接创建对象，是对原型继承模型的简化

无论是经典的原型继承还是class来声明的类继承，都会用new运算调用一次构造器函数，“构造”这一过程既包括对原型链的维护，也包括对新实例的修饰——甚至可以使用`Reflect.construct()`来代替`new`运算，以便更加细致的控制构造过程中`new.target`和所创建实例的`constructor`的值。

new运算的可替代性，让我们注意到一个事实，所谓原型继承，其本质只是“复制原型“，即以原型为模板复制一个新的对象，构造函数与`new`运算等过程所附加的效果，其实对复制原型来说是无意义的

其构造器函数对实例的这种修饰作用——对于原型继承来说——可有可无。于是就出现了`Object.create`这样的一种简单的方法，它将”构造器函数“从对象创建过程中赶了出去，在这种机制中，对象变成了简单的”原型继承+属性定义“，而不再需要”构造器“这样一层语义

`Object.create()`只是能避免使用构造器来设置新实例原型的一种方法。它没有了在构造器修饰对象实例的这一过程，但和class声明一样，在本质上仍然是原型继承

#### 3.4.3.5 如何选择继承的方式
类抄写与原型继承正好是互补的两种方案

* 类抄写时成员访问效率更高，但内存占用更大；而原型继承反之
* 类抄写不依赖内部原型链来维护继承关系，因此也不能通过`instanceof`来做这种检测；原型继承却维护着这种继承关系也可以用于检测

JS根本上是针对小型系统和轻量应用环境设计的，它兼具“动态、函数式、原型继承”等多种语言特性，在灵活多变的同时也带来了一种混杂的程序设计语言知识体系，其结果是易学难精，而且越是深入底层越容易感到混乱，它虽然能组织大型对象系统，但又对大型对象系统的封装和多态处理的不够，所以在大型应用中常常束手束脚，心有余而力不足，这也是ES6之后在类继承语言特性设计上所主要需要解决的问题，包括更强的封装特性，以及类静态语法注解等等

在继承方式的选择上，仍应择需而用：其一，在大型系统上必须采用类继承的思想，继承关系的确定性和支持静态语法检测等特性，可以帮助开发者最终简化构建大型系统开发和业务逻辑的实现，并提供足够的系统稳定性，=；其二，在小型结构或者体系的局部使用原型继承的思路，既可以有优美的实现和高效的性质，也可以深入地理解JavaScript中混合不同语言特性的精髓

### 3.4.4 内置的对象系统
标准规范下的JS有38个内置对象，包括7个在语法形式上具有字面量风格的声明，其中三种字面量(Number、Boolean、String)定义的是值类型数据，可以通过包装类转换至相应的对象类型。

特殊类型`Global`它只有一个全局存在的单例，即所谓的`global`。由于没有任何规范要求在JS环境中存在一个名为`global`的变量并指向上述对象，或者显式地定义其构造器函数`Global()`，因此唯一能在所有引擎中通用的、得到`global`对象的方法，是借用`Function`对象来实现的
```js
var global = (new Function('return this'))();
```

一旦得到这个对象，就可以列举这个对象中的全局名字，这些名字就是你可以访问的整个内置对象系统，以及所有“泄露”到全局的变量（它们也作为global的属性，以便作为一个全局可以访问的标识符来使用）

理解`Global()`类与`global`对象，是理解JS内置对象系统的起点，它既代表了这个系统中逻辑执行的最终范围，也代表了这个系统的全体。因此下边的代码在语义和执行效果上是一致的
```js
new Object()
new global.Object()
```

#### 3.4.4.1 早期规范中的对象
与`global`对象类似，`Arguments`也是在早起就被规范过的对象，并且也没有一个显式声明过的构造器，`Arguments()`实例总是由函数引擎在函数调用时动态创建并添加在函数闭包中的，因此能在函数执行代码中直接使用`arguments`这个标识符，它看起来像是一个数组，但是并非数组对象

另一个早起规范过的对象是`Error()`构造器，它用于创建一个可以用throw语句抛出的错误对象

此外，最常见的对象是`Date()`构造器，JS中的时间是从19700101:00:00为相对基点的毫秒数

还有一个就是`Math`，它不是构造器，而是作为全局单例对象提供了一些数学运算相关的方法

有且仅有一个对象不在`global`所代表的对象系统中，即不能由它们的类或者子类创建，这就是`null`对象，JS中的`Null`作为类型只有一个字面量形式的`null`值，并且它也是一个对象，与`null`作为对象不同的是，`undefined`是一个值，但是被定义在了`global`中
```js
Object.getOwnPropertyDescripter(global, 'undefined')
/*
value: undefined,
writable: false,
enumerable: false,
configurable: false
*/
```

#### 3.4.4.2 集合对象
JS提供两种集合(Collection Types)对象，其中索引集合包含数组和类型化数组，而键值集合包括Map、WeakMap、Set、WeakSet。此外，JS也设计了语句`for..of`用于列举集合中的成员

但是数组本质上和对象没啥不同，我们也不认为`Array()`对象的各个元素在具体引擎中进行存储时有着内存地址的连续性，因此JS的数组时异质、交错和稀疏的，可以存在不连续的下标，以及保存任意类型的元素

由于存储的不连续性，以及元素的不一致，因此有着巨大的性能问题，所以JS也提供了类型化数组

数组本质上时提供集合元素有序访问的，而键值集合(Keyed Collections)则是无序的，其中`Map()`对象是一个键值对的集合，其`get()/set()、delete()、has()`等主要运算时面向键值对的key的，而`Set()`对象则强调集合中的元素值无重复，主要运算`add()、delete()、has()`等都是操作元素的值的。

#### 3.4.4.3 结构化数据对象
所有的`TypedArray`对象其实都是结构化的数据(Structured Data)，它们本身也都是基于`ArrayBuffer()`对象来实现的

#### 3.4.4.4 反射对象
通过反射(Reflection)机制，可以访问、检测和修改对象的内部状态和行为，其中，反射对象`Reflect`用于提供反射机制的一个常用界面——但它不是使用反射机制的唯一方法。Reflect对象的功能可以通过其他方法或者语法实现

| Reflect.xxx方法 | 可替代方法 | 备注 |
| : -- : | : -- : | : -- : |
| apply(target, ...) | target.apply() | 调用函数 |
| construct(target, args, ...) | new target(...args) | 创建实例（注1） |
| getPrototypeOf(target) | Objcet.getPrototypeOf(target) | 读原型 |
| setPrototypeOf(target) | Objcet.setPrototypeOf(target) | 写原型 |
| get(target, prop, ...) | target[prop] | 属性读 |
| set(target, prop, ...) | target[prop] = xxx | 属性写 |
| has(target, prop) | prop in target | 属性检查 |
| deleteProperty(target, prop) | delete target[prop] | 属性表删除 |
| defineProperty(target, ...) | Object.defineProperty() | 属性表增加 |
| getOwnPropertyDescriptor(...) | Object.getOwnPropertyDescriptor() | 属性表列举 |
| ownKeys(target) | （注2） | 属性表列举 |
| isExtensible(target) | Object.isExtensible(target) | 属性表管理（禁止拓展） |
| perventExtensions(target) | Objcet.perventExtensions(target) | 属性表管理（禁止拓展）|

> 注1：考虑到在构造器中`new.target`的设置该方法没办法通过Shim代码完整实现

> 注2：该方法返回全部自有的字符串键名和符号键名的属性，可以用如下类似代码代替

```js
function Reflect_ownKeys(target) {
  return Objcet.getOwnPropertySymbols(target)
    .concat(Objcet.getOwnPropertyNames(target))
}
```

`Reflect`对象用于调用对象的行为，于此不同`Proxy`类从另一个角度来实现反射，它用于改变对象的行为。Proxy可以代理目标对象的全部行为，并通过助手对象`handler`上的陷阱来响应“在代理对象上发生的”指定行为。这些行为的界面和`Reflect`是一致的，也就是说每个可被反射的`Reflect.xxx`方法都由一个对应的、可声明为`handler.xxx`的陷阱

#### 3.4.4.5 其他
JS提供了一类称为“控制抽象”的对象，包括迭代器、生成器、Promise类

### 3.4.5 特殊效果的继承
一些内置对象具有特殊效果，譬如一些值可以在调用一些方法的时候当作对象处理，或者函数对象可以执行等等

使用一般原型继承会导致子类失去特殊效果，使用类继承就可以了

## 可定制的对象属性
在完全不考虑对象如何实现和存储的情况下，仅其语义而言：对象，就是一组（零到任意多个）属性的集合，即所谓的“对象是属性包”。所以属性的性质也并不用于描述该属性的类型或者作用，而主要描述这个属性和集合之间的关系，这些关系有三种：`Writable`（可写）、`Enumerable`（可枚举）、`Configurable`（可配置）。除此之外一个属性本身还具有两种性质：Name、Value，即名字和值。
### 3.5.1 属性描述符
在使用字面量时，其实是用“名称、值”的方式快速地定义了上述属性性质的一个简化版
```js
obj = {
  name: 'value'
}
```
而JS内部使用属性描述符的不同，可以分成两类：
* 数据属性： a named data property,兼容ES3的一般属性，如上例中的obj.name
* 存取属性： a named accessor property, 用 get/set 定义的属性

#### 3.5.1.1 数据描述符
仍以上例为例，它的描述符如下
```js
{
  value: 'value', // 数据描述，默认undefined
  writable: true, // 是否可写,默认true，
  enumerable: true, // 是否可列举，默认true
  configurable: true // 是否可重新配置，默认true
}
```

#### 3.5.1.2 存取描述符
带读写器的存取描述符与上述的数据描述符只能存在一种，而不可能同时存在，其格式为
```js
{
  get: function() {}, // 默认undefined
  set: function(new_value) {}, // 默认undefined
  enumerable: true,
  configurable: true
}
```
必须具有get或者set两种方法之一，并且方法内可以通过this获取对象本身，也就获取到了访问对象本身其他成员或者调用它们的方法。

由于this指向对象本身，所以有可能间接的访问到当前属性，造成死锁，应注意避免

> 在使用Object.defineProperty、Object.defineProperties 或 Object.create 函数的情况下添加数据属性，writable、enumerable和configurable默认值为false。

#### 3.5.1.3 隐式创建的描述符：字面量风格的对象或者类声明
字面量声明对象风格中不存在对Enumerable和Configurable的定义，所以总是使用默认值true

在字面量声明过程中，只存在两种方式而且不能共存，分别是数据描述和存取描述

存取描述中只有`set`或者只有`get`就表明该属性是只写或者只读的，两个都有就可读写

使用类声明（包括字面量风格的类表达式声明）时，属性的描述符创建规则与上述一致，需要指出的是，类静态成员会声明为类的属性，而一般成员会声明为类的原型的属性

### 3.5.2 定制对象属性
在3.1.3对象成员中，我们将对象、类的属性从继承性的角度分为了两类
* 自有属性： own properties，该属性创建于对象的自由属性表中
* 继承属性： inherited properites，该属性是父类原型上的自有属性（即创建于原型对象的自有属性表中）

从子类对象的角度更加细分的来看，覆盖属性覆盖了父类原型上的同名属性，也是一种（子类自有）的自有属性，最后还有一类自有属性被称之为内部属性它是每个对象实例内部的、自有的属性，部分内部属性是可以被继承的，或者可以被某些公开方法影响的，因此子类实例也可以覆盖它们

#### 3.5.2.1 给属性赋值
包括四种情况

情况一：属性不存在，隐式创建一个数据描述符

情况二：属性是当前对象自有的，只要是可写的就正常赋值，否则什么都不做或者在严格模式下报错

情况三：属性是继承的，而且是数据描述符，就在自有属性表创建数据描述符，然后按默认初始化，赋值

情况四：属性是使用的存取描述符，无论读写的性质是什么都不会新建属性描述符，子类继承了这样的一个属性也会忠实的调用（继承来的、原型中的）读写器

#### 3.5.2.2 使用属性描述符
在JS中不能直接修改属性描述符的性质以影响源对象，因为属性描述符只是复制了对象属性的内部性质，而不是这些性质的直接引用

创建属性的方法

`Object.defineProperty(obj, name, descriptor)`为对象声明一个属性
```js
Object.defineProperty(obj1, 'a_name', {
  get: function() {},
  configurable: false
})
```

`Object.defineProperties(obj, descriptors)`为对象声明一组属性
```js
Object.defineProperties(obj1, {
  'a_name': {
    get: function() {},
    configurable: false
  },
  'b_name': {
    get: function() {},
    configurable: false
  }
})
```

`Object.create(prototype, descriptors)`创建对象并并为对象声明一组属性

如果在子类中尝试定义父类的同名属性，该属性将变成子类对象中的”自有属性“，但不同的是，“重新定义属性”这个操作于原型中该属性是否可写或者是否允许修改性质是无关的，事实上，无法阻止子类对父类同名属性的重定义，也没有办法避免重定义带来的逻辑问题，关于这一点，可以简单的总结为：**属性的性质不可继承**

#### 3.5.2.3 取属性或属性列表
JS定义了一组非常丰富的方法来操作这些属性

| 分类 | Objcet.xxx方法或者语法元素 | 说明 |
| :--: | :--: | :--: |
| 取属性描述符 | getOwnPropertyDescruotors(obj) | 取所有描述符，含名字、值和性质 |
| 取属性描述符 | getOwnPropertyDescriptor(obj, name) | 取指定属性名的描述符 |
| 取属性名 | getOwnPropertyNames(obj) | 取对象自有的、字符串的属性名数组 |
| 取属性名 | getOwnPropertySymbols(obj) | 取对象自有的、符号的属性名数组 |
| 取属性名 | keys(obj) | 取对象自有的、可见的属性名数组 |
| 取属性名 | for...in | 列举可见的属性名 |
| 取属性值 | for...of | 列举成员中的数组元素 |
| 取属性值 | values(obj) | 取对象自有的、可见的属性值数组 |
| 取属性值 | entries(obj) | 取对象自有的、可见的名值对数组 |
| 取属性值 | .和[]运算符，以及解构赋值等 | （按属性名取值） |

### 3.5.3 属性表的状态
对象有一个内部属性`[[Extensible]]`用来影响其自有属性表的相关行为，该属性的默认值是`true`，表明一个对象是可以被添加或者删除的，于此相关，还有两组与操作自有属性表的方法

| 分类 | Objcet.xxx方法 | 说明 | 对自有属性表的操作 |
| :--: | :--: | :--: | :--: |
| 状态维护 | preventExtensions(obj) | 使实例obj不能添加新属性，也不可重置原型 | 禁止表add |
| 状态维护 | seal(obj) | 使实例obj不能添加新属性，也不能删除既有属性 | 禁止表add/delete |
| 状态维护 | freeze(obj) | 使实例obj所有属性只读，且不能添加新属性，也不能删除既有属性 | 禁止表add/delete/update （冻结表）|
| 状态检查 | isExtensible(obj) | 返回[[Extensible]]值 | 是可增加属性项的 |
| 状态检查 | isSealed(obj) | 返回seal状态 | 密封的（禁止删除的） |
| 状态检查 | isFrozen(obj) | 返回freeze状态 | 冻结的 |

seal和freeze的状态不是直接的状态值，而是基于[[Extensible]]和现有的自有属性（的性质）计算出来的、动态的值：
* seal是[[Extensible]]为false，所有自有属性的configurable性质为false
* seal是[[Extensible]]为false，所有自有属性的configurable和writable性质为false

对于一个自有属性表为空的对象使用`preventExtensions`将同时导致它密封和冻结

存取属性并不受freeze状态的“置属性只读”的影响

当父类（原型）冻结或者指定属性只读，赋值运算会失效，但能用重新声明属性的方法达到与赋值运算相同的效果

> 属性表的性质不可继承