---
title: JS基础类型API整理--收尾
tags: [js, 基础]
categories: [语言, js]
index_img: /img/js-other-title.png
banner_img: /img/js.jpg
date: 2020-07-03 16:34:00
---
# JavaScript
## JSON
### JSON.parse
将字符串转化为JSON
```js
const json = '{"result":true, "count":42}';
const obj = JSON.parse(json);

console.log(obj.count);
// expected output: 42

console.log(obj.result);
// expected output: true
```

### JSON.stringify
将JSON转化为字符串
```js
console.log(JSON.stringify({ x: 5, y: 6 }));
// expected output: "{"x":5,"y":6}"

console.log(JSON.stringify([new Number(3), new String('false'), new Boolean(false)]));
// expected output: "[3,"false",false]"

console.log(JSON.stringify({ x: [10, undefined, function(){}, Symbol('')] }));
// expected output: "{"x":[10,null,null,null]}"

console.log(JSON.stringify(new Date(2006, 0, 2, 15, 4, 5)));
// expected output: ""2006-01-02T15:04:05.000Z""
```

## Date
处理时间的函数，平时就用个时间戳`new Date().getTime()`剩下得几乎用不到，[文档链接](https://devdocs.io/javascript/global_objects/date)

## Math
数学用函数，只整理常用的，其余看文档，[文档链接](https://devdocs.io/javascript/global_objects/math)
### Math.abs
取绝对值
```js
function difference(a, b) {
  return Math.abs(a - b);
}

console.log(difference(3, 5));
// expected output: 2

console.log(difference(5, 3));
// expected output: 2

console.log(difference(1.23456, 7.89012));
// expected output: 6.6555599999999995
```

### Math.ceil
返回大于等于给定量的最小整数
```js
console.log(Math.ceil(.95));
// expected output: 1

console.log(Math.ceil(4));
// expected output: 4

console.log(Math.ceil(7.004));
// expected output: 8

console.log(Math.ceil(-7.004));
// expected output: -7
```

### Math.floor
返回小于给定量的最大整数
```js
console.log(Math.floor(5.95));
// expected output: 5

console.log(Math.floor(5.05));
// expected output: 5

console.log(Math.floor(5));
// expected output: 5

console.log(Math.floor(-5.05));
// expected output: -6
```

### Math.max
返回给定值最大的一个
```js
console.log(Math.max(1, 3, 2));
// expected output: 3

console.log(Math.max(-1, -3, -2));
// expected output: -1

const array1 = [1, 3, 2];

console.log(Math.max(...array1));
// expected output: 3
```

### Math.min
返回给定值最小的那个
```js
console.log(Math.min(2, 3, 1));
// expected output: 1

console.log(Math.min(-2, -3, -1));
// expected output: -3

const array1 = [2, 3, 1];

console.log(Math.min(...array1));
// expected output: 1
```

### Math.pow
返回给定的量指定次数的幂
```js
console.log(Math.pow(7, 3));
// expected output: 343

console.log(Math.pow(4, 0.5));
// expected output: 2

console.log(Math.pow(7, -2));
// expected output: 0.02040816326530612
//                  (1/49)

console.log(Math.pow(-7, 0.5));
// expected output: NaN
```

### Math.random
返回一个`[0,1)`之间随机的数
```js
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

console.log(getRandomInt(3));
// expected output: 0, 1 or 2

console.log(getRandomInt(1));
// expected output: 0

console.log(Math.random());
// expected output: a number between 0 and 1
```

### Math.round
返回给定数的舍入后的整数
```js
console.log(Math.round(0.9));
// expected output: 1

console.log(Math.round(5.95), Math.round(5.5), Math.round(5.05));
// expected output: 6 6 5

console.log(Math.round(-5.05), Math.round(-5.5), Math.round(-5.95));
// expected output: -5 -5 -6
```

### Math.sign
返回给定数的符号，正1负-1零0
```js
console.log(Math.sign(3));
// expected output: 1

console.log(Math.sign(-3));
// expected output: -1

console.log(Math.sign(0));
// expected output: 0

console.log(Math.sign('-3'));
// expected output: -1
```

### Math.sqrt
返回给定数的平方根
```js
function calcHypotenuse(a, b) {
  return (Math.sqrt((a * a) + (b * b)));
}

console.log(calcHypotenuse(3, 4));
// expected output: 5

console.log(calcHypotenuse(5, 12));
// expected output: 13

console.log(calcHypotenuse(0, 0));
// expected output: 0
```

## Number
数字类型，[文档链接](https://devdocs.io/javascript/global_objects/number)
### Number.isInteger
判定给定值是否是整数
```js
function fits(x, y) {
  if (Number.isInteger(y / x)) {
    return 'Fits!';
  }
  return 'Does NOT fit!';
}

console.log(fits(5, 10));
// expected output: "Fits!"

console.log(fits(5, 11));
// expected output: "Does NOT fit!"
```

### Number.isFinite
判定给定值是否是有限数
```js
console.log(Number.isFinite(1 / 0));
// expected output: false

console.log(Number.isFinite(10 / 5));
// expected output: true

console.log(Number.isFinite(0 / 0));
// expected output: false
```

### number.toPrecision
方法返回表示Number对象到指定的精度的字符串
```js
function precise(x) {
  return Number.parseFloat(x).toPrecision(4);
}

console.log(precise(123.456));
// expected output: "123.5"

console.log(precise(0.004));
// expected output: "0.004000"

console.log(precise('1.23e+5'));
// expected output: "1.230e+5"
```

### Number.MAX_VALUE
js中最大正整数

### Number.MAX_SAFE_INTEGER
js最大安全整数

### Number.MIN_SAFE_INTEGER
js最小安全整数

### Number.MIN_VALUE
js最小正整数值

## Map
是ES6新增的，相较于对象就是属性名可以为任意值
### map.@@iterator
很明显，map是可以迭代的
```js
const map1 = new Map();

map1.set('0', 'foo');
map1.set(1, 'bar');

const iterator1 = map1[Symbol.iterator]();

for (let item of iterator1) {
  console.log(item);
}
// expected output: Array ["0", "foo"]
// expected output: Array [1, "bar"]
```

### map.clear
清空map
```js
const map1 = new Map();

map1.set('bar', 'baz');
map1.set(1, 'foo');

console.log(map1.size);
// expected output: 2

map1.clear();

console.log(map1.size);
// expected output: 0
```

### map.delete
移出map中的某个元素
```js
const map1 = new Map();
map1.set('bar', 'foo');

console.log(map1.delete('bar'));
// expected result: true
// (true indicates successful removal)

console.log(map1.has('bar'));
// expected result: false
```

### map.entries
返回一个可迭代的对象，每次返回键值对的数组
```js
const map1 = new Map();

map1.set('0', 'foo');
map1.set(1, 'bar');

const iterator1 = map1.entries();

console.log(iterator1.next().value);
// expected output: ["0", "foo"]

console.log(iterator1.next().value);
// expected output: [1, "bar"]
```

### map.forEach
对每个键值对都执行一次某个操作
```js
function logMapElements(value, key, map) {
  console.log(`m[${key}] = ${value}`);
}

new Map([['foo', 3], ['bar', {}], ['baz', undefined]])
  .forEach(logMapElements);

// expected output: "m[foo] = 3"
// expected output: "m[bar] = [object Object]"
// expected output: "m[baz] = undefined"
```

### map.get
获取map的某个键对应的值，没有返回undefined
```js
const map1 = new Map();
map1.set('bar', 'foo');

console.log(map1.get('bar'));
// expected output: "foo"

console.log(map1.get('baz'));
// expected output: undefined
```

### map.has
查询某个键是否存在
```js
const map1 = new Map();
map1.set('bar', 'foo');

console.log(map1.has('bar'));
// expected output: true

console.log(map1.has('baz'));
// expected output: false
```

### map.keys
返回一个可迭代的对象，值是map的键
```js
const map1 = new Map();

map1.set('0', 'foo');
map1.set(1, 'bar');

const iterator1 = map1.keys();

console.log(iterator1.next().value);
// expected output: "0"

console.log(iterator1.next().value);
// expected output: 1
```

### map.set
设置一个键值对到map里边
```js
const map1 = new Map();
map1.set('bar', 'foo');

console.log(map1.get('bar'));
// expected output: "foo"

console.log(map1.get('baz'));
// expected output: undefined
```

### map.size
返回map的大小，也就是多少个元素
```js
const map1 = new Map();

map1.set('a', 'alpha');
map1.set('b', 'beta');
map1.set('g', 'gamma');

console.log(map1.size);
// expected output: 3
```

### map.values
返回一个可迭代对象，值是map的值
```js
const map1 = new Map();

map1.set('0', 'foo');
map1.set(1, 'bar');

const iterator1 = map1.values();

console.log(iterator1.next().value);
// expected output: "foo"

console.log(iterator1.next().value);
// expected output: "bar"
```

## Set
和Map的api是一样的，不过不允许存在重复的值，所以可以用来进行数组去重，[文档链接](https://devdocs.io/javascript/global_objects/set)