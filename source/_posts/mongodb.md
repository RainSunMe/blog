---
title: mongoDB学习笔记
tags: [数据库, mongoDB]
categories: [数据库, mongoDB]
index_img: /img/mongodb-title.jpg
banner_img: /img/tag.jpg
date: 2019-11-30 21:58:44
---
# mongoDB

### 创建新用户
```js
db.createUser(
  {
    user: "yingbo",
    pwd: "",
    roles: [ { role: "dbAdmin", db: "yingbo" },{ role: 'readWrite', db: "yingbo"} ]
  }
)

db.createUser(
  {
    user: "admin",
    pwd: "",
    roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
  }
)
```

### log目录 `/var/log/mongodb/mongod.log`

### db目录 `/var/lib/mongo`

### 配置文件 `/etc/mongod.conf`

### 启动/重启/停止  `sudo service mongod start/restart/stop`

### 开启用户认证 conf 文件加 
```
security:
  authorization: enabled
```
### 登录
``` c
//方法一
mongo --port 12236 -u "admin" -p "" --authenticationDatabase "admin"
//方法二
db.auth("yingbo", "")
```

### 显示所有数据库
`show dbs`

### 删库
```
use <dbname>
db.dropDatabase()
```

### 显示所有集合
`show tables` 或者 `show collections`

### 创建集合
```js
//正常情况下直接插入数据就可以自动新建一个集合

//创建固定集合 mycol，整个集合空间大小 6142800 KB, 文档最大个数为 10000 个。
db.createCollection("<collectionName>", { capped : true, autoIndexId : true, size : 
   6142800, max : 10000 } )

//单纯的新建一个集合
db.createCollection("<collectionName>")
```

### 删除集合
`db.<collectionName>.drop()`

### 增
`db.<collectionName>.insert(<object>)`

### 删
`db.<collectionName>.remove({key:value})` find里边可以为{}删除全部

### 改
```
db.<collectionName>.update(
   <query>,
   <update>,
   {
     upsert: <boolean>,
     multi: <boolean>,
     writeConcern: <document>
   }
)
/*
    query : update的查询条件，类似sql update查询内where后面的。
    update : update的对象和一些更新的操作符（如$,$inc...）等，也可以理解为sql update查询内set后面的
    upsert : 可选，这个参数的意思是，如果不存在update的记录，是否插入objNew,true为插入，默认是false，不插入。
    multi : 可选，mongodb 默认是false,只更新找到的第一条记录，如果这个参数为true,就把按条件查出来多条记录全部更新。
    writeConcern :可选，抛出异常的级别。
*/
```

### 查
`db.<collectionName>.find({key:value})` find里边可以没有参数
```
//格式化显示
db.col.find().pretty()

//条件语句
db.col.find({likes : {$lt :200, $gt : 100}}).pretty() //限制 100<likes<200

$lt:小于
$lte:小于或等于
$gt:大于
$gte:大于或等于
$ne: 不等于

$type: 
    Double 	1 	 
    String 	2 	 
    Object 	3 	 
    Array 	4 	 
    Binary data 	5 	 
    Undefined 	6 	已废弃。
    Object id 	7 	 
    Boolean 	8 	 
    Date 	9 	 
    Null 	10 	 
    Regular Expression 	11 	 
    JavaScript 	13 	 
    Symbol 	14 	 
    JavaScript (with scope) 	15 	 
    32-bit integer 	16 	 
    Timestamp 	17 	 
    64-bit integer 	18 	 
    Min key 	255 	Query with -1.
    Max key 	127

//AND
db.col.find({key1:value1, key2:value2}).pretty()

//OR
db.col.find({$or:[{"by":"菜鸟教程"},{"title": "MongoDB 教程"}]}).pretty()

//AND+OR
db.col.find({"likes": {$gt:50}, $or: [{"by": "菜鸟教程"},{"title": "MongoDB 教程"}]}).pretty()

// 排除某个字段，例如_id
db.col.find({},{"_id": 0})

// 指定返回某几个字段
db.col.find({},{"name": 1, "sex": 1})
```

---

## Limit与Skip方法

`db.<collectionName>.find().limit(<number1>).skip(<number2>)`

number1 : 本次查询最多显示条数

number2 : 本次查询跳过的条数

---

## sort() 方法

`db.<collectionName>.find().sort({<key>:<number>})`

key : 需要进行排序的键名

number : 其中 1 为升序排列，而 -1 是用于降序排列

---

## createIndex() 方法

`db.values.createIndex({<key>: <number>, <key>: <number>}, {background: true})`

key : 需要进行排序的键名

number : 其中 1 为升序排列，而 -1 是用于降序排列

建索引过程会阻塞其它数据库操作，background可指定以后台方式创建索引，即增加 "background" 可选参数。 "background" 默认值为false。

---

## aggregate() 方法

```
db.mycol.aggregate([{$group : {_id : "$by_user", num_tutorial : {$sum : 1}}}])
{
   "result" : [
      {
         "_id" : "runoob.com",
         "num_tutorial" : 2
      },
      {
         "_id" : "Neo4j",
         "num_tutorial" : 1
      }
   ],
   "ok" : 1
}
```

$sum	计算总和。	db.mycol.aggregate([{$group : {_id : "$by_user", num_tutorial : {$sum : "$likes"}}}])

$avg	计算平均值	db.mycol.aggregate([{$group : {_id : "$by_user", num_tutorial : {$avg : "$likes"}}}])

$min	获取集合中所有文档对应值得最小值。	db.mycol.aggregate([{$group : {_id : "$by_user", num_tutorial : {$min : "$likes"}}}])

$max	获取集合中所有文档对应值得最大值。	db.mycol.aggregate([{$group : {_id : 
"$by_user", num_tutorial : {$max : "$likes"}}}])

$push	在结果文档中插入值到一个数组中。	db.mycol.aggregate([{$group : {_id : "$by_user", url : {$push: "$url"}}}])

$addToSet	在结果文档中插入值到一个数组中，但不创建副本。	db.mycol.aggregate([{$group : {_id : "$by_user", url : {$addToSet : "$url"}}}])

$first	根据资源文档的排序获取第一个文档数据。	db.mycol.aggregate([{$group : {_id : "$by_user", first_url : {$first : "$url"}}}])

$last	根据资源文档的排序获取最后一个文档数据	db.mycol.aggregate([{$group : {_id : "$by_user", last_url : {$last : "$url"}}}])


## 管道

$project：修改输入文档的结构。可以用来重命名、增加或删除域，也可以用于创建计算结果以及嵌套文档。
```
结果中就只还有_id,tilte和author三个字段
db.article.aggregate(
    { $project : {
        title : 1 ,
        author : 1 ,
    }}
 );

连id一起删除
db.article.aggregate(
    { $project : {
        _id : 0 ,
        title : 1 ,
        author : 1
    }});

```


$match：用于过滤数据，只输出符合条件的文档。$match使用MongoDB的标准查询操作。
```
db.articles.aggregate( [
  { $match : { score : { $gt : 70, $lte : 90 } } },
  { $group: { _id: null, count: { $sum: 1 } } }
] );
```

$limit：用来限制MongoDB聚合管道返回的文档数。

$skip：在聚合管道中跳过指定数量的文档，并返回余下的文档。
```
db.article.aggregate(
    { $skip : 5 });
```
$unwind：将文档中的某一个数组类型字段拆分成多条，每条包含数组中的一个值。

$group：将集合中的文档分组，可用于统计结果。

$sort：将输入文档排序后输出。

$geoNear：输出接近某一地理位置的有序文档。

---

## MongoDB 复制（副本集）

等树莓派装完再看

## MongoDB 分片

等树莓派装完再看

## 备份

`mongodump -h dbhost -d dbname -o dbdirectory`


-h：
MongDB所在服务器地址，例如：127.0.0.1，当然也可以指定端口号：127.0.0.1:27017

-d：
需要备份的数据库实例，例如：test

-o：
备份的数据存放位置，例如：c:\data\dump，当然该目录需要提前建立，在备份完成后，系统自动在dump目录下建立一个test目录，这个目录里面存放该数据库实例的备份数据。 

## 恢复

`mongorestore -h <hostname><:port> -d dbname <path>`

```
--host <:port>, -h <:port>：
MongoDB所在服务器地址，默认为： localhost:27017

--db , -d ：
需要恢复的数据库实例，例如：test，当然这个名称也可以和备份时候的不一样，比如test2

--drop：
恢复的时候，先删除当前数据，然后恢复备份的数据。就是说，恢复后，备份后添加修改的数据都会被删除，慎用哦！

<path>：
mongorestore 最后的一个参数，设置备份数据所在位置，例如：c:\data\dump\test。

你不能同时指定 <path> 和 --dir 选项，--dir也可以设置备份目录。

--dir：
指定备份的目录

你不能同时指定 <path> 和 --dir 选项。
```