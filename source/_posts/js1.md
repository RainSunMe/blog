---
title: JavaScript学习笔记1
tags: [js, 基础]
categories: [语言, js]
index_img: /img/js-title.jpg
banner_img: /img/js.jpg
date: 2020-04-06 14:33:00
---
# JavaScript
## 作用域和闭包
### LHS 和 RHS
L 和 R 代表左右

> LHS 赋值操作的目标是谁
> RHS 谁是赋值操作的源头

变量出现在赋值操作的左边对其进行`LHS`查询，即试图找到该容器并可对其进行赋值操作，**与其原先是否有内容无关**

变量出现在赋值操作的右边对其进行`RHS`查询，即试图找到该容器中的**内容**

### ReferenceError同作用域判别失败有关
严格模式下进行LHS查询失败就会出现，**非严格模式**下会自动创建一个变量

RHS查询失败一定会报这个错误

TypeError代表作用域判别成功了但是对**结果的操作**是非法的或者不合理的

LHS查询是从底层一层一层**向上**找的，所以下一级的变量会对上级的变量形成“遮蔽”现象

`eval(<str>)`中间的str可以当成一开始就写在那个位置的代码使用，可以对上一级的变量进行“遮蔽”

`with(obj){ a = 1 } => obj.a = 1` with会创建一个作用域，并把obj的所有属性和方法放进去，进行的是正常的LHS查询，但是这就导致了当obj中没有被赋值的属性的时候就会在全局作用域中创建一个变量导致变量泄露到全局作用域即`obj.a => undefined`,`window.a => 2`

> eval和with都会导致引擎对代码的优化失败从而降低运行效率

### IIFE(Immediately Invoked Function Expression)：立即执行函数
可以把window当成参数直接传进去，形参是global

将一个参数命名为undefined但是不传参数就能保证undefined是真的undefined，防止被覆盖，例如`undefined = true`这种代码

尽量减少使用匿名函数，直接加上个名字就好，这样在出错的时候更容易找到位置
### 块作用域
  * **with**
  * **try/catch** (ES3就有了)
    * catch里边就是一个作用域，看上去像是一个函数作用域（类似）
  * **let**创建的变量并不会被提升，所以在声明之前使用都会报ReferenceError错误
    * 为代码提供一个显式的作用域并使用let可以让引擎在合适的时间回收垃圾
  * **const** 可以创建块作用域变量
  
> 词法作用域关注函数在何处声明，动态作用域关注函数从何处调用
### Traceur 
使用google的Traceur可以将es6转换为es5，将let转换为try/catch

### 提升
提升的时候函数优先也就是说
```js
foo() //1
var foo // 重复声明而被忽略
function foo(){ // 由于优先而被提升到最顶，然后就执行了foo
  console.log(1)
}
foo = function() {
  console.log(2)
}
```
`var a = 2; => var a; a = 2;`引擎将其拆成两个声明，一个是在编译阶段的任务，一个是在执行阶段的任务

声明本身会被提升，但是包括函数表达式的赋值在内的赋值操作都不会被提升

当函数可以记住并访问所在的词法作用域，即使函数是在当前词法作用域之外执行，这时就产生了闭包

### 模块
为创建内部作用域而调用了一个包装函数

包装函数的返回值至少包括一个对内部函数的引用，这样就会创建涵盖整个包装函数内部作用域的闭包

## this和对象原型
### this
箭头函数会使this继承上一级的this

使用bind将外边的this传进入也更加靠谱

this既不指向函数自身，也不指向函数的作用域

### 绑定 
#### 默认绑定
  * 独立函数调用，此时this指向全局作用域，但是如果使用严格模式则会绑定undefined
  * 虽然this绑定规则完全取决于调用位置，但是只有函数运行在非strict mode下时，默认绑定才能绑定到全局对象；在严格模式下调用函数则不会影响默认绑定

#### 隐式绑定
  * 调用位置是否有上下文对象，或者说时被某个对象拥有或者包含
  * `function foo(){} var obj = {foo:foo} obj.foo()`此时this指向obj
  * `function foo(){} var obj1 = {foo:foo} var obj2 = {obj1:obj1} obj2.obj1.foo()`此时this指向obj1，即对象属性引用链中只有上一层或者说最后一层调用位置中起作用
  * `function foo(){} var obj = {foo:foo} var bar = obj.foo bar()`此时bar的this指向全局对象（隐式丢失），虽然bar是obj.foo的一个引用，但是实际上，它引用的是foo函数本身，因此此时的bar()其实是一个不带任何修饰的函数调用，因此应用了默认绑定

#### 显式绑定
  * call和apply以及bind的详细介绍[链接](https://blog.csdn.net/wyyandyou_6/article/details/81488103)
  * `arr.forEach(fn(currentValue, index, arr),thisValue)`在thisValue显式绑定this

#### new绑定
  * 包括内置对象函数在内的所有函数都可以使用new来调用，这种函数调用被称为构造函数调用
  * 使用new来调用函数，或者发生构造函数调用时，会自动执行下面的操作
    * 创建（或者说构造）一个全新的对象
    * 这个新对象会执行Prototype连接
    * 这个新对象会绑定到函数调用的this（**new绑定**）
    * 如果函数没有返回其他对象，那么new表达式中的函数调用会自动返回这个新对象

> 优先级 new绑定 > 显示绑定 > 隐式绑定 > 默认绑定，在bind函数中会判断是不是new调用，new优先

> 如果把null或者undefined作为this的绑定对象传入call、apply或者bind，这些值在调用的时候或被忽略，实际应用的是默认绑定规则
> 接上，但是假如函数中确实使用到了this就会污染全局作用域，所以使用`Object.create(null)`,来创建一个空对象，比{}还少一个prototype，用这个代替null当作this的绑定对象

柯里化[链接](https://www.jianshu.com/p/2975c25e4d71)

软绑定[链接](https://segmentfault.com/q/1010000006223479)

#### 箭头函数下的this
  * 箭头函数不适用this的四种标准规则，而是根据外层（函数或者全局）作用域来决定this
  * 箭头函数绑定的this无法被改变，即使是new也不行
  * this指向调用时上级的this
  * 以后要尽量减少that=this的写法，多用bind以及箭头函数

## 对象
  * 可以通过声明形式(可以添加多个键值对)和构造模式(必须逐个添加属性)定义

### 六种主要类型（语言类型）
`string number boolean null undefined object`,除了**object**都不是对象类型
  
> 由于对象底层表示为二进制，前三位为0被判定为object，但是null二进制全为零，**所以执行typeof会返回object**
### 内置对象 
`String Number Boolean Object Function Array Date RegExp Error`

* 一般情况下，引擎会把字面量转化为对应的对象，但是`null`和`undefined`只有**文字形式**，`Date`只有**构造形式**

* 对于 `Object Function Array RegExp` 来说不论是文字形式还是构造形式都是对象，不是字面量

* `.a`属性访问 `['a']` 键访问,键访问可以接受任意UTF-8/Unicode字符串作为属性名，例如'Super-Fun!'

* es6中在字面量定义对象属性时，加上`[变量]`就可以做到可计算属性名

### 复制
  * `JSON.parse(JSON.stringify(obj))`的方式复制不了function
  * `Object.assign({}, obj1,...)`的方式可以浅复制，包括function

### 属性描述符
  * 查看`Object.getOwnPropertyDiscriptor(obj, <key>)`
  * 设置
    ```js
    Object.defineProperty(obj,'a',{
      value: 2, //值
      writable: true, // 可写，设置false时类似设置setter为空，此时修改值会报typeError（严格模式），非严格模式会静默失败
      configurable: true, // 可配置，单向操作，设置为false之后就改不回来了并且不可删除(delete，非严格模式会静默失败)，但是仍可以设置writable为false，不管是不是严格模式修改不可配置的属性描述符都会出错
      enumerable: true // 可枚举，如果不想让其出现在for...in 循环中就设置为false
    })
    ```
  * 不变性
    * 对象常量：结合`configurable: false,writable: false,`就可以创建一个真正的常量属性（不可修改，重定义或删除）
    * 禁止拓展：`Object.preventExtensions(obj)`禁止对象添加新的属性并且保留已有属性
    * 密封：`Object.seal(obj)`相当于禁止拓展加`configurable: false`即不能添加新的属性也不能重新配置或删除任何现有属性
    * 冻结：`Object.freeze()`相当于先密封再`writable: false`，但是仍不能冻结这个对象引用的对象
      * 深度冻结，先冻结该对象，然后遍历其子对象然后冻结
  * `[[get]]`先在obj中查找属性名相同的属性，没有就去查询原型链
  * `[[put]]`先看有没有setter（优先使用），然后看是不是writable
  * get 和 set
    * ```js
      var obj = {
        // 给a定义一个getter
        get a() {
          return this._a_
        },
        set a(val) {
          this._a_ = val * 2
        }
      }
      Object.defineProperty(
        obj,
        'b',
        {
          get: function() {return this._a_ * 2},
          //确保b会出现在对象的属性列表中
          enumerable: true
        }
      )
      obj.a = 2
      obj.a // 4
      obj.b // 4
      ```
    * 以上操作都会在obj中创建一个不包含值的属性，对于这个属性的访问会自动调用一个隐藏函数，返回值即是被当作属性访问的返回值
    * 在定义新属性时，get和set不能同value或者writable一起出现否则报TypeError
  * 存在性
    * `a in obj`in操作符或检查对象及其原型链
      * in操作符只检查的是属性名，而不是值，所以 `4 in [4,1,2] -> false`
    * `obj.hasOwnProperty('a')`只检查对象，不检查原型链
      * 对于没有原型链的对象如`Object.create(null)`可`Object.prototype.hasOwnProerty.call(obj)`显式绑定
    * `Object.keys(obj)`查看对象中所有键，只显示可枚举属性，并且不会查找原型链，返回数组
    * `Object.getOwnPropertyNames(obj)`返回数组，包含所有属性，不论是否可枚举，不会查找原型链
    * `obj.propertyIsEnumerable('a')`返回Boolean，查看该元素是否可枚举

## 遍历
### 数组
  * forEach：忽略回调函数的返回值
  * every：会一直运行到回调函数返回false
  * some：会一直运到到回调函数返回true
  * 数组可以直接for of循环出所有的值
  * for of实际上是调用的迭代器对象
  * 数组
    ```js
    var arr = []
    var it = arr[Symbol.iterator]()
    it.next() // {value: 1, done: false}
    //...
    it.next() // {done: true}
    ``` 
    注意:最后会出现这个`{done: true}`

### 对象
  * 对象并没有@@iterator所以无法完成for of 遍历，但是可以自己写一个
    ```js
    // 会生成无限个随机数
    var randoms = {
      [Symbol.iterator]: function() {
        return :function() {
          return {value: Math.random()}
        }
      }
    }
    // -----------------------------------
    var obj = {
      a: 2,
      b: 3
    }
    Object.defineProperty(obj, Symbol.iterator,{
      enumerable: false,
      writable: false,
      configurable: true,
      value: function(){
        var o = this;
        var idx = 0;
        var ks = Object.keys(o)
        return {
          next: function(){
            return {
              value: o[ks[idx++]],
              done: (idx > ks.length)
            }
          }
        }
      }
    })
    // 手动遍历
    var it = obj[Symbol.iterator]()
    it.next() //{ value: 2, done:false}
    it.next() //{ value: 3, done:false}
    it.next() //{ done:true}
    // 使用for of
    for(var v of obj) {
      console.log(v)
    }
    // 2
    // 3
    ```

## 混合对象“类”
  * 设计模式：实例化，继承，(相对)多态
  * 多态并不能表示子类和父类有关联，子类得到的只是父类的一个副本，类的继承实际上就是复制
  * super关键字用于访问和调用一个对象的父对象上的函数。`super.prop`和`super[expr]`表达式在类和对象字面量任何方法定义中都是有效的。
  * js本身并不支持多重继承
  * 类意味着复制，js并不会自动创建对象的副本
  * 混入模式可以模拟类的复制行为，但是会产生丑陋并且脆弱的语法。
  * 而且对象（函数）只能复制引用，无法复制被引用的对象或者函数本身，所以在js中模拟类是得不偿失的，虽然可以解决当前的问题，但是可能会留下更多的隐患

### 原型
  *  `Object.create(...)`创建一个对象并将其`prototype`关联到指定对象
  *  所有对象的`prototype`最终都指向了内置的`Object.prototype`其中包含类如`.toString();.valueOf()`之类的方法

#### 分析
如果foo不直接存在于obj上而是存在于原型链上层时会出现的三种情况
  *  如果上层的foo是普通的数据访问属性，并且没有被标记为只读，那就会在对象上直接创建foo属性，它是遮蔽属性
  *  如果上层的foo是只读属性的话，严格模式下会抛出一个错误，正常模式下静默失败，可以理解为obj继承了foo但是foo是只读属性，所以不可更改（实际上js并没有继承这一概念，只是为了理解、
     *  而且仅限于 = 赋值中，使用`Object.defineProperty()`并不会受到任何影响
     *  如果上层的foo存在且是一个setter，就会调用这个setter，foo不会重新定义也不会直接添加到obj中

####  模仿类
  *  利用所有函数都会拥有一个名为`prototype`的共有且不可枚举的属性，并且会指向另一个对象
  *  通过`new foo()`最后我们得到了两个对象，并且他们互相关联，实际上new并没有直接创建关联，这个关联只是一个意外的副作用
  *  new 会劫持所有的函数并用构造对象的形式来调用它，而且无论如何都会构造一个对象，换句话说在js中对于“构造函数”最准确的解释是：所有带new的函数调用
  *  函数被创建的时候会默认在其`prototype`中声明一个不可枚举的`construct`属性，指向它自己，使用`new`创建一个对象的时候由于其`prototype`会链接到函数的`prototype`上，所以`obj.construct`会委托到`prototype`上也就是指向了函数，但是如果那个函数重定义了整个`prototype`，再去查找`obj.construct`就会一层一层委托到`Object`的`construct`上，也就是指向`Object`，总结一下就是说construct并不能表示由“某函数”创建，尽量不要使用它以减少麻烦
  *  实现类的继承,实际上是委托
     *  方法一`Bar.prototype = Object.create(Foo.prototype)`
     *  方法二`Object.setPrototypeOf(Bar.prototype, Foo.prototype)` ES6语法
  *  `__proto__`存在于`Object.prototype`中，看起来像一个属性，但是更像是getter/setter
  *  创建关联最好的方式不是创建一个类，而是使用`Object.create()`
  *  所有包含"继承"之类的词语都不适合形容js的操作，更应该使用"委托"，因为“继承”是复制操作（由上至下的），"委托"是链接操作（由下至上的）

#### 行为委托
   *  js中`[[prototype]]`这个机制的本质就是**对象之间的关联关系**
   *  在正常的模仿类的设计中，上代码！  
      ```js  
      function Foo(who) {
        this.me = who
      }
      Foo.prototype.indetify = function() {
        return "I am" + this.me
      }
      function Bar(who) {
        Foo.call(this, who)
      }   
      Bar.prototype = Object.create(Foo.prototype)
      Bar.prototype.speak = function() {
        alert('Hello,'+ this.indetify() + '.')
      }
      var b1 = new Bar('b1')
      var b2 = new Bar('b2')
      b1.speak()
      b2.speak()
      ```
   *  在es6的语法糖中，上代码！
      ```js
      class Foo {
        constructor(who) {
          this.me = who
        }
        indetify(){
          return "I am" + this.me
        }
      }
      class Bar extends Foo {
        constructor(who) {
          super(who)
        }
        speak(){
          alert('Hello,'+ super.indetify() + '.')
        }
      }
      var b1 = new Bar('b1')
      var b2 = new Bar('b2')
      b1.speak()
      b2.speak()
      ``` 

   * 在关联风格代码中的实现，上代码！
      ```js
      var Foo = {
        init: function(who) {
          this.me = who
        },
        indetify: function() {
          return "I am" + this.me
        }
      }
      var Bar = Object.create(Foo)
      Bar.speak = function() {
        alert('Hello,'+ this.indetify() + '.')
      }
      var b1 = Object.create(Bar)
      b1.init('b1')
      var b2 = Object.create(Bar)
      b2.init('b2')
      b1.speak()
      b2.speak()
      ```

   * 同为关联风格代码，但是进行了语法上的优化（es6中的简洁方法声明）（Object.setPrototypeOf后置关联）这样看起来舒服不少  
      ```js
      var Foo = {
        init(who) {
          this.me = who
        },
        indetify() {
          return "I am" + this.me
        }
      }
      var Bar = {
        speak() {
          alert('Hello,'+ this.indetify() + '.')
        }
      }
      Object.setPrototypeOf(Bar, Foo)
      var b1 = Object.create(Bar)
      b1.init('b1')
      var b2 = Object.create(Bar)
      b2.init('b2')
      b1.speak()
      b2.speak()
      ```
      
* instanceof 如果 Bar”继承了“Foo 那么就是 `Bar.prototype instanceof Foo => true`
* 如果`Bar = Object.create(Foo)`则`Foo.isPrototypeOf(Bar) => true`,`Object.getPrototypeOf(Bar) === Foo => ture` 