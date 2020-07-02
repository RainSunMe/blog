---
title: JS基础类型API整理--Object
tags: [js, 基础]
categories: [语言, js]
index_img: /img/js-title.jpg
banner_img: /img/js.jpg
date: 2020-07-02 15:18:00
---
# JavaScript
## Object
### Object.assign
将一个或者多个对象的可枚举属性拷贝到源对象上，会改变源对象，如果`key`相同后边会覆盖前边的
```js
const target = { a: 1, b: 2 };
const source = { b: 4, c: 5 };

const returnedTarget = Object.assign(target, source);

console.log(target);
// expected output: Object { a: 1, b: 4, c: 5 }

console.log(returnedTarget);
// expected output: Object { a: 1, b: 4, c: 5 }
```

### object.constructor
返回构造函数本身
```js
var o = {};
o.constructor === Object; // true

var o = new Object;
o.constructor === Object; // true

var a = [];
a.constructor === Array; // true

var a = new Array;
a.constructor === Array; // true

var n = new Number(3);
n.constructor === Number; // true
```

### Object.create
创建一个新对象，传入的参数就是新对象的原型
```js
const person = {
  isHuman: false,
  printIntroduction: function() {
    console.log(`My name is ${this.name}. Am I human? ${this.isHuman}`);
  }
};

const me = Object.create(person);

me.name = 'Matthew'; // "name" is a property set on "me", but not on "person"
me.isHuman = true; // inherited properties can be overwritten

me.printIntroduction();
// expected output: "My name is Matthew. Am I human? true"
```

### Object.defineProperties
方法直接在对象上定义了新的或修改现有的属性，并返回该对象
```js
const object1 = {};

Object.defineProperties(object1, {
  property1: {
    value: 42,
    writable: true
  },
  property2: {}
});

console.log(object1.property1);
// expected output: 42
```

### Object.defineProperty
方法直接在对象上定义了新的或修改现有的属性，并返回该对象
```js
const object1 = {};

Object.defineProperty(object1, 'property1', {
  value: 42,
  writable: false
});

object1.property1 = 77;
// throws an error in strict mode

console.log(object1.property1);
// expected output: 42
```

### Object.entries
可以获取对象的一个可迭代属性，value是一个数组`[key,val]`，但是是没有顺序的，如果需要顺序可以使用`Object.entries(obj).sort((a, b) => a[0] - b[0]);`
```js
const object1 = {
  a: 'somestring',
  b: 42
};

for (const [key, value] of Object.entries(object1)) {
  console.log(`${key}: ${value}`);
}

// expected output:
// "a: somestring"
// "b: 42"
// order is not guaranteed
```

### Object.freeze
冻结一个对象，不能添加删除或者修改，当然对象里边的对象的内容仍可被修改
```js
const obj = {
  prop: 42
};

Object.freeze(obj);

obj.prop = 33;
// Throws an error in strict mode

console.log(obj.prop);
// expected output: 42
```

### Object.fromEntries
用于将键值对数组转化为对象，本质上是调用的数组的迭代器
```js
const entries = new Map([
  ['foo', 'bar'],
  ['baz', 42]
]);

const obj = Object.fromEntries(entries);

console.log(obj);
// expected output: Object { foo: "bar", baz: 42 }
```

### Object.getOwnPropertyDescriptor
获取对象中某一个属性的信息，是否可写，`getter,setter`之类的
```js
const object1 = {
  property1: 42
};

const descriptor1 = Object.getOwnPropertyDescriptor(object1, 'property1');

console.log(descriptor1.configurable);
// expected output: true

console.log(descriptor1.value);
// expected output: 42
```

### Object.getOwnPropertyDescriptors
获取对象中所有属性的信息，就是上一个的集合
```js
const object1 = {
  property1: 42
};

const descriptors1 = Object.getOwnPropertyDescriptors(object1);

console.log(descriptors1.property1.writable);
// expected output: true

console.log(descriptors1.property1.value);
// expected output: 42
```

### Object.getOwnPropertyNames
获取全部属性名，包含不可枚举属性
```js
const object1 = {
  a: 1,
  b: 2,
  c: 3
};

console.log(Object.getOwnPropertyNames(object1));
// expected output: Array ["a", "b", "c"]

var my_obj = Object.create({}, {
  getFoo: {
    value: function() { return this.foo; },
    enumerable: false
  }
});
my_obj.foo = 1;

console.log(Object.getOwnPropertyNames(my_obj).sort()); 
// logs ["foo", "getFoo"]
```

### Object.getOwnPropertySymbols
获取对象中全部符号属性
```js
const object1 = {};
const a = Symbol('a');
const b = Symbol.for('b');

object1[a] = 'localSymbol';
object1[b] = 'globalSymbol';

const objectSymbols = Object.getOwnPropertySymbols(object1);

console.log(objectSymbols);
// expected output: Array [Symbol(a), Symbol(b)]
```

### Object.getPrototypeOf
获取对象的原型对象
```js
const prototype1 = {};
const object1 = Object.create(prototype1);

console.log(Object.getPrototypeOf(object1) === prototype1);
// expected output: true
```

### object.hasOwnProperty
判断一个对象是否有该属性，而不是继承来的
```js
const object1 = {};
object1.property1 = 42;

console.log(object1.hasOwnProperty('property1'));
// expected output: true

console.log(object1.hasOwnProperty('toString'));
// expected output: false

console.log(object1.hasOwnProperty('hasOwnProperty'));
// expected output: false
```
> 这个函数能被直接覆写，遇到这种情况使用`Object.hasOwnProperty.call()`

### Object.is
用于判定两个值是否相同，不限于对象
```js
Object.is('foo', 'foo');     // true
Object.is(window, window);   // true

Object.is('foo', 'bar');     // false
Object.is([], []);           // false

var test = { a: 1 };
Object.is(test, test);       // true

Object.is(null, null);       // true

// Special Cases
Object.is(0, -0);            // false
Object.is(-0, -0);           // true
Object.is(NaN, 0/0);         // true
```

### Object.isExtensible
用来判断一个对象是否是可拓展的
```js
const object1 = {};

console.log(Object.isExtensible(object1));
// expected output: true

Object.preventExtensions(object1);

console.log(Object.isExtensible(object1));
// expected output: false
```

### Object.isFrozen
用于确认对象是否被冻结
```js
const object1 = {
  property1: 42
};

console.log(Object.isFrozen(object1));
// expected output: false

Object.freeze(object1);

console.log(Object.isFrozen(object1));
// expected output: true
```

### object.isPrototypeOf
用于判定对象是否在另一个对象的原型链中
```js
function Foo() {}
function Bar() {}
function Baz() {}

Bar.prototype = Object.create(Foo.prototype);
Baz.prototype = Object.create(Bar.prototype);

var baz = new Baz();

console.log(Baz.prototype.isPrototypeOf(baz)); // true
console.log(Bar.prototype.isPrototypeOf(baz)); // true
console.log(Foo.prototype.isPrototypeOf(baz)); // true
console.log(Object.prototype.isPrototypeOf(baz)); // true
```

### Object.isSealed
用来判断对象是否被**密封**，如果对象设置为不可拓展或者设置`configurable: false`会返回`true`
```js
// Objects aren't sealed by default.
var empty = {};
Object.isSealed(empty); // === false

// If you make an empty object non-extensible,
// it is vacuously sealed.
Object.preventExtensions(empty);
Object.isSealed(empty); // === true

// The same is not true of a non-empty object,
// unless its properties are all non-configurable.
var hasProp = { fee: 'fie foe fum' };
Object.preventExtensions(hasProp);
Object.isSealed(hasProp); // === false

// But make them all non-configurable
// and the object becomes sealed.
Object.defineProperty(hasProp, 'fee', {
  configurable: false
});
Object.isSealed(hasProp); // === true

// The easiest way to seal an object, of course,
// is Object.seal.
var sealed = {};
Object.seal(sealed);
Object.isSealed(sealed); // === true

// A sealed object is, by definition, non-extensible.
Object.isExtensible(sealed); // === false

// A sealed object might be frozen,
// but it doesn't have to be.
Object.isFrozen(sealed); // === true 
// (all properties also non-writable)

var s2 = Object.seal({ p: 3 });
Object.isFrozen(s2); // === false 
// ('p' is still writable)

var s3 = Object.seal({ get p() { return 0; } });
Object.isFrozen(s3); // === true
// (only configurability matters for accessor properties)
```

### Object.keys
获取对象的键，只有可枚举属性
```js
// simple array
var arr = ['a', 'b', 'c'];
console.log(Object.keys(arr)); // console: ['0', '1', '2']

// array like object
var obj = { 0: 'a', 1: 'b', 2: 'c' };
console.log(Object.keys(obj)); // console: ['0', '1', '2']

// array like object with random key ordering
var anObj = { 100: 'a', 2: 'b', 7: 'c' };
console.log(Object.keys(anObj)); // console: ['2', '7', '100']

// getFoo is a property which isn't enumerable
var myObj = Object.create({}, {
  getFoo: {
    value: function () { return this.foo; }
  } 
});
myObj.foo = 1;
console.log(Object.keys(myObj)); // console: ['foo']
```

### Object.preventExtensions
禁止对象进行拓展
```js
// Object.preventExtensions returns the object
// being made non-extensible.
var obj = {};
var obj2 = Object.preventExtensions(obj);
obj === obj2; // true

// Objects are extensible by default.
var empty = {};
Object.isExtensible(empty); // === true

// ...but that can be changed.
Object.preventExtensions(empty);
Object.isExtensible(empty); // === false

// Object.defineProperty throws when adding
// a new property to a non-extensible object.
var nonExtensible = { removable: true };
Object.preventExtensions(nonExtensible);
Object.defineProperty(nonExtensible, 'new', {
  value: 8675309
}); // throws a TypeError

// In strict mode, attempting to add new properties
// to a non-extensible object throws a TypeError.
function fail() {
  'use strict';
  // throws a TypeError
  nonExtensible.newProperty = 'FAIL';
}
fail();
```

### object.propertyIsEnumerable
用于判定指定的属性是否可枚举
```js
const object1 = {};
const array1 = [];
object1.property1 = 42;
array1[0] = 42;

console.log(object1.propertyIsEnumerable('property1'));
// expected output: true

console.log(array1.propertyIsEnumerable(0));
// expected output: true

console.log(array1.propertyIsEnumerable('length'));
// expected output: false
```

### Object.seal
密封一个对象，密封之前的对象允许修改值，密封之后不允许删除属性，新增的属性不允许修改值
```js
var obj = {
  prop: function() {},
  foo: 'bar'
};

// New properties may be added, existing properties
// may be changed or removed.
obj.foo = 'baz';
obj.lumpy = 'woof';
delete obj.prop;

var o = Object.seal(obj);

o === obj; // true
Object.isSealed(obj); // === true

// Changing property values on a sealed object
// still works.
obj.foo = 'quux';

// But you can't convert data properties to accessors,
// or vice versa.
Object.defineProperty(obj, 'foo', {
  get: function() { return 'g'; }
}); // throws a TypeError

// Now any changes, other than to property values,
// will fail.
obj.quaxxor = 'the friendly duck';
// silently doesn't add the property
delete obj.foo;
// silently doesn't delete the property

// ...and in strict mode such attempts
// will throw TypeErrors.
function fail() {
  'use strict';
  delete obj.foo; // throws a TypeError
  obj.sparky = 'arf'; // throws a TypeError
}
fail();

// Attempted additions through
// Object.defineProperty will also throw.
Object.defineProperty(obj, 'ohai', {
  value: 17
}); // throws a TypeError
Object.defineProperty(obj, 'foo', {
  value: 'eit'
}); // changes existing property value
```

### object.toString
将对象字符串化，正常返回`[Object Object]`，可以使用`Symbol.toStringTag 与 Symbol.hasInstance`改变第二个tag，详见你不知道的js下
```js
function Dog(name) {
  this.name = name;
}

const dog1 = new Dog('Gabby');

Dog.prototype.toString = function dogToString() {
  return `${this.name}`;
};

console.log(dog1.toString());
// expected output: "Gabby"
```

### object.valueOf
方法返回指定对象的原始值
```js
function MyNumberType(n) {
  this.number = n;
}

MyNumberType.prototype.valueOf = function() {
  return this.number;
};

const object1 = new MyNumberType(4);

console.log(object1 + 3);
// expected output: 7
```

### Object.values
返回对象的可枚举的属性值的数组用于`for in`循环
```js
const object1 = {
  a: 'somestring',
  b: 42,
  c: false
};

console.log(Object.values(object1));
// expected output: Array ["somestring", 42, false]
```