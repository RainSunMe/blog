---
title: JS基础类型API整理--Array
tags: [js, 基础]
categories: [语言, js]
index_img: /img/js-title.jpg
banner_img: /img/js.jpg
date: 2020-06-29 20:10:00
---
# JavaScript
## Array
### array.concat
用于合并两个或更多个数组，此方法不改变现有的数组，而是返回一个新的数组。
```js
const array1 = ['a', 'b', 'c'];
const array2 = ['d', 'e', 'f'];
const array3 = array1.concat(array2);
console.log(array3);
// expected output: Array ["a", "b", "c", "d", "e", "f"]
```
### array.copyWithin
用于将该数组的一部分覆写到另一部分上，用法：`arr.copyWithin(target, start, end)`
```js
const array1 = ['a', 'b', 'c', 'd', 'e'];

// copy to index 0 the element at index 3
console.log(array1.copyWithin(0, 3, 4));
// expected output: Array ["d", "b", "c", "d", "e"]

// copy to index 1 all elements from index 3 to the end
console.log(array1.copyWithin(1, 3));
// expected output: Array ["d", "d", "e", "d", "e"]
```

### array.entries
用于获取数组的Iterator，但是比正常的多了当前的index
```js
const array1 = ['a', 'b', 'c'];

const iterator1 = array1.entries();

console.log(iterator1.next().value);
// expected output: Array [0, "a"]

console.log(iterator1.next().value);
// expected output: Array [1, "b"]

let iterator2 = array1[Symbol.iterator]();
console.log(iterator2.next().value);
// expected output: String "a"
```

### array.every
传入一个方法，会遍历该数组到方法里，方法返回`true`或者`false`，只要有一个是`false`就返回`false`，用于检测该数组的内容是不是都符合某条件
```js
const isBelowThreshold = (currentValue) => currentValue < 40;

const array1 = [1, 30, 39, 29, 10, 13];

console.log(array1.every(isBelowThreshold));
// expected output: true
```

### array.fill
用于填充数组的指定段，用法：`arr.fill(value[, start[, end]])`
```js
const array1 = [1, 2, 3, 4];

// fill with 0 from position 2 until position 4
console.log(array1.fill(0, 2, 4));
// expected output: [1, 2, 0, 0]

// fill with 5 from position 1
console.log(array1.fill(5, 1));
// expected output: [1, 5, 5, 5]

console.log(array1.fill(6));
// expected output: [6, 6, 6, 6]
```

### array.filter
用于过滤数组内容，传入一个方法，遍历数组到该方法里，方法返回`true`则将该元素放进新数组，然后返回新数组
```js
const words = ['spray', 'limit', 'elite', 'exuberant', 'destruction', 'present'];
const result = words.filter(word => word.length > 6);
console.log(result);
// expected output: Array ["exuberant", "destruction", "present"]
```

### array.find
找到数组中第一个满足条件的元素并返回，如果没有满足的元素就返回`undefined`
```js
const array1 = [5, 12, 8, 130, 44];
const found = array1.find(element => element > 10);
console.log(found);
// expected output: 12
```

### array.findIndex
找到数组中第一个满足条件的元素的下标并返回，如果没有满足的元素就返回`-1`
```js
const array1 = [5, 12, 8, 130, 44];
const isLargeNumber = (element) => element > 13;
console.log(array1.findIndex(isLargeNumber));
// expected output: 3
```

### array.forEach
遍历数组，如果有第二个参数就绑定到第一个方法的this
```js
const array1 = ['a', 'b', 'c'];

array1.forEach(element => console.log(element));

// expected output: "a"
// expected output: "b"
// expected output: "c"
```

### Array.from
生成一个新数组，还可以传入一个遍历的函数，对每个元素进行遍历操作，用法：`Array.from(arrayLike[, mapFn[, thisArg]])`

可转化Set和Map还有arguments为真实的数组
```js
console.log(Array.from('foo'));
// expected output: Array ["f", "o", "o"]

console.log(Array.from([1, 2, 3], x => x + x));
// expected output: Array [2, 4, 6]

Array.from({length: 5}, (v, i) => i);
// [0, 1, 2, 3, 4]
```

### array.includes
查询数组是否包含某元素
```js
const array1 = [1, 2, 3];
console.log(array1.includes(2));
// expected output: true
const pets = ['cat', 'dog', 'bat'];
console.log(pets.includes('cat'));
// expected output: true
console.log(pets.includes('at'));
// expected output: false
```

### array.indexOf
用于查询数组中第一个该元素的位置，没有该元素就返回`-1`，用法：`arr.indexOf(searchElement[, fromIndex])`，`fromIndex`可省，指定开始搜索的位置
```js
const beasts = ['ant', 'bison', 'camel', 'duck', 'bison'];
console.log(beasts.indexOf('bison'));
// expected output: 1
// start from index 2
console.log(beasts.indexOf('bison', 2));
// expected output: 4
console.log(beasts.indexOf('giraffe'));
// expected output: -1
```

### Array.isArray
用于判定传入的参数是否是数组，返回`boolean`
```js
Array.isArray([1, 2, 3]);  // true
Array.isArray({foo: 123}); // false
Array.isArray('foobar');   // false
Array.isArray(undefined);  // false
```

### array.join
用于将数组的内容拼成字符串，传入的参数就是分割符
```js
const elements = ['Fire', 'Air', 'Water'];
console.log(elements.join());
// expected output: "Fire,Air,Water"
console.log(elements.join(''));
// expected output: "FireAirWater"
console.log(elements.join('-'));
// expected output: "Fire-Air-Water"
```

### array.lastIndexOf
返回给定的内容在数组中最后一次出现的位置，如果没有返回`-1`，用法：`arr.lastIndexOf(searchElement[, fromIndex])`，`fromIndex`可省，指定开始搜索的位置
```js
const animals = ['Dodo', 'Tiger', 'Penguin', 'Dodo'];

console.log(animals.lastIndexOf('Dodo'));
// expected output: 3

console.log(animals.lastIndexOf('Tiger'));
// expected output: 1
```

### Array.length
获取数组的长度，是一个32位整数
```js
const clothing = ['shoes', 'shirts', 'socks', 'sweaters'];
console.log(clothing.length);
// expected output: 4
```

### array.map
根据遍历函数的返回值返回一个新的数组
```js
const array1 = [1, 4, 9, 16];
// pass a function to map
const map1 = array1.map(x => x * 2);
console.log(map1);
// expected output: Array [2, 8, 18, 32]
```

### Array.of
根据参数创建一个新数组，与直接new的差别在于对整数的处理，传入数字表示创建一个包含该数字的数组而不是创建一个长度为该数字的空数组
```js
Array.of(7);       // [7] 
Array.of(1, 2, 3); // [1, 2, 3]

Array(7);          // [ , , , , , , ]
Array(1, 2, 3);    // [1, 2, 3]
```

### array.pop
弹出数组的最后一个元素，返回该元素，同时会改变原数组
```js
const plants = ['broccoli', 'cauliflower', 'cabbage', 'kale', 'tomato'];
console.log(plants.pop());
// expected output: "tomato"
console.log(plants);
// expected output: Array ["broccoli", "cauliflower", "cabbage", "kale"]
```

### array.push
向数组末尾添加一个元素，返回添加后的数组长度
```js
const animals = ['pigs', 'goats', 'sheep'];
const count = animals.push('cows');
console.log(count);
// expected output: 4
console.log(animals);
// expected output: Array ["pigs", "goats", "sheep", "cows"]
animals.push('chickens', 'cats', 'dogs');
console.log(animals);
// expected output: Array ["pigs", "goats", "sheep", "cows", "chickens", "cats", "dogs"]
```
> 可以用这个模拟cancat，但是没什么用就是了
```js
var vegetables = ['parsnip', 'potato'];
var moreVegs = ['celery', 'beetroot'];

// Merge the second array into the first one
// Equivalent to vegetables.push('celery', 'beetroot');
Array.prototype.push.apply(vegetables, moreVegs);
console.log(vegetables); // ['parsnip', 'potato', 'celery', 'beetroot']
```

### array.reduce
执行传入的方法最终返回一个值，传入的方法有四个参数，依次是：累加器(acc)，当前遍历的值(cur)，当前遍历的下标(idx)，整个数组(src)，第二个参数是一个初始的默认值，可以不加
```js
const array1 = [1, 2, 3, 4];
const reducer = (accumulator, currentValue) => accumulator + currentValue;

// 1 + 2 + 3 + 4
console.log(array1.reduce(reducer));
// expected output: 10

// 5 + 1 + 2 + 3 + 4
console.log(array1.reduce(reducer, 5));
// expected output: 15
```

### array.reduceRight
和上边一样，不过是从右边开始遍历
```js
const array1 = [[0, 1], [2, 3], [4, 5]].reduceRight(
  (accumulator, currentValue) => accumulator.concat(currentValue)
);

console.log(array1);
// expected output: Array [4, 5, 2, 3, 0, 1]
```

### array.reverse
反转整个数组`
```js
const array1 = ['one', 'two', 'three'];
console.log('array1:', array1);
// expected output: "array1:" Array ["one", "two", "three"]

const reversed = array1.reverse();
console.log('reversed:', reversed);
// expected output: "reversed:" Array ["three", "two", "one"]

// Careful: reverse is destructive -- it changes the original array.
console.log('array1:', array1);
// expected output: "array1:" Array ["three", "two", "one"]
```
> 注意：这个方法会改变原数组

### array.shift
弹出数组的第一个元素，会改变原数组的长度
```js
const array1 = [1, 2, 3];

const firstElement = array1.shift();

console.log(array1);
// expected output: Array [2, 3]

console.log(firstElement);
// expected output: 1
```

### array.slice
获得数组某一段的**浅拷贝**，用法：`arr.slice([begin[, end]])`
```js
const animals = ['ant', 'bison', 'camel', 'duck', 'elephant'];

console.log(animals.slice(2));
// expected output: Array ["camel", "duck", "elephant"]

console.log(animals.slice(2, 4));
// expected output: Array ["camel", "duck"]

console.log(animals.slice(1, 5));
// expected output: Array ["bison", "camel", "duck", "elephant"]

```

### array.some
和`array.every`相反，传入一个方法，会遍历该数组到方法里，方法返回`true`或者`false`，只要有一个是`true`就返回`true`，用于检测该数组是不是有符合某条件的元素
```js
const array = [1, 2, 3, 4, 5];

// checks whether an element is even
const even = (element) => element % 2 === 0;

console.log(array.some(even));
// expected output: true
```

### array.sort
用于进行数组排序，可以传入自定义排序函数，默认情况下是转成`UTF-16`比较首字符进行排序的，会改变原数组
```js
const months = ['March', 'Jan', 'Feb', 'Dec'];
months.sort();
console.log(months);
// expected output: Array ["Dec", "Feb", "Jan", "March"]

const array1 = [1, 30, 4, 21, 100000];
array1.sort();
console.log(array1);
// expected output: Array [1, 100000, 21, 30, 4]

var numbers = [4, 2, 5, 1, 3];
numbers.sort(function(a, b) {
  return a - b;
  // 如果大于0将a后移，如果小于0将b后移
});
console.log(numbers);

// [1, 2, 3, 4, 5]
```

### array.splice
用于替换数组中某一部分
```js
const months = ['Jan', 'March', 'April', 'June'];
months.splice(1, 0, 'Feb');
// inserts at index 1
console.log(months);
// expected output: Array ["Jan", "Feb", "March", "April", "June"]

months.splice(4, 1, 'May');
// replaces 1 element at index 4
console.log(months);
// expected output: Array ["Jan", "Feb", "March", "April", "May"]
```

### array.toString
将数组转化成字符串
```js
const array1 = [1, 2, 'a', '1a'];

console.log(array1.toString());
// expected output: "1,2,a,1a"
```

### array.unshift
将一个或者多个元素添加到数组的开头，并返回改变后的数组长度
```js
const array1 = [1, 2, 3];

console.log(array1.unshift(4, 5));
// expected output: 5

console.log(array1);
// expected output: Array [4, 5, 1, 2, 3]
```
### array.keys
返回一个数组下标的迭代器
```js
const array1 = ['a', 'b', 'c'];
const iterator = array1.keys();
for (const key of iterator) {
  console.log(key);
}
// expected output: 0
// expected output: 1
// expected output: 2
```
> 对于空元素Array.keys和Object.keys不太一样
```js
var arr = ['a', , 'c'];
var sparseKeys = Object.keys(arr);
var denseKeys = [...arr.keys()];
console.log(sparseKeys); // ['0', '2']
console.log(denseKeys);  // [0, 1, 2]
```

### array.values
返回一个数组内容的迭代器
```js
const array1 = ['a', 'b', 'c'];
const iterator = array1.values();

for (const value of iterator) {
  console.log(value);
}

// expected output: "a"
// expected output: "b"
// expected output: "c"

var a = ['w', 'y', 'k', 'o', 'p']; 
var iterator = a.values();

console.log(iterator.next().value); // w 
console.log(iterator.next().value); // y 
console.log(iterator.next().value); // k 
console.log(iterator.next().value); // o 
console.log(iterator.next().value); // p
```
