---
title: JS基础类型API整理--String
tags: [js, 基础]
categories: [语言, js]
index_img: /img/js-string-title.png
banner_img: /img/js.jpg
date: 2020-06-30 16:50:00
---
# JavaScript
## String
### string.@@iterator
string类型是可迭代的
```js
let str = 'test string'
let ite = str[Symbol.iterator]()
console.log(ite.next().value) // t
```
### string.charAt
获取字符串某一位的内容，无参数默认第一位，下标从0开始
```js
let str = 'text string'
console.log(str.charAt()) // t
console.log(str.charAt(6)) // s 
```

### string.concat
用于拼接一个或者多个字符串,返回一个新的字符串不会改变源字符串
```js
let str = 'test string'
let con_str = ' is cool!'
console.log(str.concat(con_str)) // test string is cool!
```

### string.endsWith
查看该字符串是否以传入的字符串结尾，可以传入裁剪的字符串长度
```js
var str = 'To be, or not to be, that is the question.';

console.log(str.endsWith('question.')); // true
console.log(str.endsWith('to be'));     // false
console.log(str.endsWith('to be', 19)); // true
```

### string.includes
查看传入字符串能不能在该字符串中找到，返回`boolean`
```js
const sentence = 'The quick brown fox jumps over the lazy dog.';

const word = 'fox';

console.log(`The word "${word}" ${sentence.includes(word) ? 'is' : 'is not'} in the sentence`);
// expected output: "The word "fox" is in the sentence"
```

### string.indexOf
查找传入的字符串第一次出现在该字符串的位置，如果没找到返回`-1`，第二个参数是开始检索的位置
```js
const paragraph = 'The quick brown fox jumps over the lazy dog. If the dog barked, was it really lazy?';

const searchTerm = 'dog';
const indexOfFirst = paragraph.indexOf(searchTerm);

console.log(`The index of the first "${searchTerm}" from the beginning is ${indexOfFirst}`);
// expected output: "The index of the first "dog" from the beginning is 40"

console.log(`The index of the 2nd "${searchTerm}" is ${paragraph.indexOf(searchTerm, (indexOfFirst + 1))}`);
// expected output: "The index of the 2nd "dog" is 52"
```

### string.lastIndexOf
查找传入的字符串最后一次出现在该字符串的位置，如果没找到就返回`-1`，第二个参数是开始检索的位置
```js
const paragraph = 'The quick brown fox jumps over the lazy dog. If the dog barked, was it really lazy?';

const searchTerm = 'dog';

console.log(`The index of the first "${searchTerm}" from the end is ${paragraph.lastIndexOf(searchTerm)}`);
// expected output: "The index of the first "dog" from the end is 52"
```

### string.length
获取字符串的长度
```js
const str = 'Life, the universe and everything. Answer:';

console.log(`${str} ${str.length}`);
// expected output: "Life, the universe and everything. Answer: 42" 
```

### string.match
针对正则表达式的匹配
```js
const paragraph = 'The quick brown fox jumps over the lazy dog. It barked.';
const regex = /[A-Z]/g;
const found = paragraph.match(regex);
console.log(found);
// expected output: Array ["T", "I"]
```

### string.normalize
将字符码转化成字符串
```js
const name1 = '\u0041\u006d\u00e9\u006c\u0069\u0065';
const name2 = '\u0041\u006d\u0065\u0301\u006c\u0069\u0065';

console.log(`${name1}, ${name2}`);
// expected output: "Amélie, Amélie"
console.log(name1 === name2);
// expected output: false
console.log(name1.length === name2.length);
// expected output: false

const name1NFC = name1.normalize('NFC');
const name2NFC = name2.normalize('NFC');

console.log(`${name1NFC}, ${name2NFC}`);
// expected output: "Amélie, Amélie"
console.log(name1NFC === name2NFC);
// expected output: true
console.log(name1NFC.length === name2NFC.length);
// expected output: true
```

### string.padEnd
在字符串的末尾添加重复的字符串，如果没有参数，填充空格
```js
const str1 = 'Breaded Mushrooms';

console.log(str1.padEnd(25, '.'));
// expected output: "Breaded Mushrooms........"

const str2 = '200';

console.log(str2.padEnd(5));
// expected output: "200  "
```

### string.padStart
在字符串的开头添加重复的字符串，如果没有参数，填充空格
```js
const str1 = '5';

console.log(str1.padStart(2, '0'));
// expected output: "05"

const fullNumber = '2034399002125581';
const last4Digits = fullNumber.slice(-4);
const maskedNumber = last4Digits.padStart(fullNumber.length, '*');

console.log(maskedNumber);
// expected output: "************5581"
```

### String.raw
直接保存该字符串到内存中，忽略转义字符
```js
// Create a variable that uses a Windows
// path without escaping the backslashes:
const filePath = String.raw`C:\Development\profile\aboutme.html`;

console.log(`The file was uploaded from: ${filePath}`);
// expected output: "The file was uploaded from: C:\Development\profile\aboutme.html"
```

### string.repeat
生成指定重复次数的字符串，输入负数会报错，输入小数会被规范成整数，类似`Math.floor()`
```js
const chorus = 'Because I\'m happy. ';

console.log(`Chorus lyrics for "Happy": ${chorus.repeat(27)}`);

// expected output: "Chorus lyrics for "Happy": Because I'm happy. Because I'm happy. Because I'm happy. Because I'm happy. Because I'm happy. Because I'm happy. Because I'm happy. Because I'm happy. Because I'm happy. Because I'm happy. Because I'm happy. Because I'm happy. Because I'm happy. Because I'm happy. Because I'm happy. Because I'm happy. Because I'm happy. Because I'm happy. Because I'm happy. Because I'm happy. Because I'm happy. Because I'm happy. Because I'm happy. Because I'm happy. Because I'm happy. Because I'm happy. Because I'm happy. "
```

### string.replace
替换字符串中的内容，如果匹配的内容是字符串就只替换第一个匹配到的内容，它的用法很多，建议直接看文档[链接](https://devdocs.io/javascript/global_objects/string/replace)
```js
const p = 'The quick brown fox jumps over the lazy dog. If the dog reacted, was it really lazy?';

const regex = /dog/gi;

console.log(p.replace(regex, 'ferret'));
// expected output: "The quick brown fox jumps over the lazy ferret. If the ferret reacted, was it really lazy?"

console.log(p.replace('dog', 'monkey'));
// expected output: "The quick brown fox jumps over the lazy monkey. If the dog reacted, was it really lazy?"
```

### String.search
匹配正则表达式，返回找到的第一个元素的位置，如果没有找到就返回`-1`
```js
const paragraph = 'The quick brown fox jumps over the lazy dog. If the dog barked, was it really lazy?';

// any character that is not a word character or whitespace
const regex = /[^\w\s]/g;

console.log(paragraph.search(regex));
// expected output: 43

console.log(paragraph[paragraph.search(regex)]);
// expected output: "."
```

### string.slice
提取字符串的一部分出来，不改变原先的字符串，如果起始位置超过了源字符串的长度，返回`""`
```js
const str = 'The quick brown fox jumps over the lazy dog.';

console.log(str.slice(31));
// expected output: "the lazy dog."

console.log(str.slice(4, 19));
// expected output: "quick brown fox"

console.log(str.slice(-4));
// expected output: "dog."

console.log(str.slice(-9, -5));
// expected output: "lazy"
```

### string.split
将字符串根据分隔符分割进数组
```js
const str = 'The quick brown fox jumps over the lazy dog.';

const words = str.split(' ');
console.log(words[3]);
// expected output: "fox"

const chars = str.split('');
console.log(chars[8]);
// expected output: "k"
```

### string.startsWith
判断该字符串是否以传入的字符串开头，传入的第二个参数是开始匹配的位置
```js
const str1 = 'Saturday night plans';

console.log(str1.startsWith('Sat'));
// expected output: true

console.log(str1.startsWith('Sat', 3));
// expected output: false
```

### string.substring
很像`string.slice`，获取字符串的一部分字串
```js
const str = 'Mozilla';

console.log(str.substring(1, 3));
// expected output: "oz"

console.log(str.substring(2));
// expected output: "zilla"
```

### string.toLocaleLowerCase
将字符串本地化并转化为小写
```js
const dotted = 'İstanbul';

console.log(`EN-US: ${dotted.toLocaleLowerCase('en-US')}`);
// expected output: "i̇stanbul"

console.log(`TR: ${dotted.toLocaleLowerCase('tr')}`);
// expected output: "istanbul"
```

### string.toLocaleUpperCase
将字符串本地化并转化为大写
```js
const city = 'istanbul';

console.log(city.toLocaleUpperCase('en-US'));
// expected output: "ISTANBUL"

console.log(city.toLocaleUpperCase('TR'));
// expected output: "İSTANBUL"
```

### string.toLowerCase
将字符串转化为小写
```js
const sentence = 'The quick brown fox jumps over the lazy dog.';

console.log(sentence.toLowerCase());
// expected output: "the quick brown fox jumps over the lazy dog."
```

### string.toString
将字符串对象转化为字符串
```js
const stringObj = new String('foo');

console.log(stringObj);
// expected output: String { "foo" }

console.log(stringObj.toString());
// expected output: "foo"
```

### string.toUpperCase
将字符串转化为大写
```js
const sentence = 'The quick brown fox jumps over the lazy dog.';

console.log(sentence.toUpperCase());
// expected output: "THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG."
```

### string.trim
去除开头和结尾的所有空白，包括但不限于空格、回车
```js
const greeting = '   Hello world!   ';

console.log(greeting);
// expected output: "   Hello world!   ";

console.log(greeting.trim());
// expected output: "Hello world!";
```

### string.trimEnd
去除结尾的所有空白，包括但不限于空格、回车，`trimRight`是该方法的别称
```js
const greeting = '   Hello world!   ';

console.log(greeting);
// expected output: "   Hello world!   ";

console.log(greeting.trimEnd());
// expected output: "   Hello world!";
```

### string.trimStart
去除开头的所有空白，包括但不限于空格、回车，`trimLeft`是该方法的别称
```js
const greeting = '   Hello world!   ';

console.log(greeting);
// expected output: "   Hello world!   ";

console.log(greeting.trimStart());
// expected output: "Hello world!   ";
```

### string.valueOf
返回字符串对象的原始值
```js
const stringObj = new String('foo');

console.log(stringObj);
// expected output: String { "foo" }

console.log(stringObj.valueOf());
// expected output: "foo"
```