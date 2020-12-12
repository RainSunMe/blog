---
title: mongoDB学习分享
tags: [数据库, mongoDB]
categories: [数据库, mongoDB]
index_img: /img/mongodb-title.jpg
banner_img: /img/tag.jpg
date: 2020-12-11 23:53:44
---

# MongoDB

## MongoDB简介
2007年10月，MongoDB由10gen团队所发展。2009年2月首度推出

MongoDB是由C++语言编写的，是一个基于分布式文件存储的开源和文档数据库系统，属于NoSQL。其数据存储形式为文档，数据结构由Key-Value键值组成

MongoDB数据库按粒度从小到大由**文档**(document)、**集合**(collection)和**数据库**(database)三部分组成

## 主要特点

- 非关系型数据库，面向文档存储，基于文档数据模型（document data model）
- BSON（Binary JSON）格式存储数据，类似于JSON
- 无架构（schema-less），可灵活扩展，存储和查询方便
- 支持索引和次级索引(secondary indexes): 次级索引是指文档或row有一个 主键(primary key)作为索引，同时允许文档或row内部还拥有一个索引（通过B-tree实现），提升查询的效率
- 可扩展性，采用低成本的横向扩展模式
- 高可用
- 高性能

**缺点**：聚合查询比较麻烦、不支持JOIN多表关联查询、不支持事物、没有严格的范式（主外键）约束、数据占用空间比较大（典型的空间换时间）

## 应用场景

基于以上特点，MongoDb的应用场景需要综合考虑

- 架构不定，后期支持扩展
- 文档存储型系统、非结构化数据存储
- 数据实时插入和更新场景
- 海量数据且数据量与日俱增
- 无需考虑事物和范式约束等业务

**不适用的场景**：高度事务性系统、传统商业智能应用、较为复杂的SQL查询等

## MongoDB快速入门

### 安装
安装包地址：[https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)

### 启动服务
启用默认端口（27017）：`mongod`

启动带访问控制：`mongod --auth --port 19908`

### 连接MongoDB
- 连接默认端口（27017）
`mongo`

- 连接指定端口
`mongo localhost:27017 或 mongo --port 27017`

- 指定用户名、密码和数据库
`mongo -port 19908 -u icsOms0UC -p 2cd7a0a543aa0 --authenticationDatabase icsOmsUnicorn`

### 常用命令

- 显示database：show dbs
- 切换database：use dbname
- 显示所有的表：show collections 或 show tables
- 查看索引：db.icsQCProcessResult.getIndexes()
- 创建索引：db.icsQCProcessResult.createIndex({sessionDate:-1})
- 删除索引：db.icsQCProcessResult.dropIndex('type_1')
- 查看用户
```
use admin
db.system.users.find()
```

### 文档操作
常用的文档操作，包括查询、插入、更新和删除以及条件操作符等

### CURD命令
- 查询文档
```js
/* query ：可选，使用查询操作符指定查询条件 projection ：可选 */
db.collection.find(query, projection)
```
- 插入文档
MongoDB提供了insert、insertOne和insertMany三个方法用于插入文档，其中前面两个方法用户插入单个文档，insertMany用于插入多个文档，文档格式为json结构
> 说明：如果要插入的集合不存在，则自动创建集合，然后插入文档

- 更新文档
一般通过update方法来实现文档的更新，update方法如下
```
db.collection.update(
   <query>,
   <update>,
   {
     upsert: <boolean>,
     multi: <boolean>,
     writeConcern: <document>
   }
)
```

- 删除文档
删除文档使用remove方法，remove方法如下
```
db.collection.remove(
   <query>,
   {
     justOne: <boolean>,
     writeConcern: <document>
   }
)
```

### 分页与排序
- 通过链接**limit和skip**方法实现分页查询，例如
```
db.icsQCResultItems.find().limit(10).skip(0)
```

- 通过sort方法实现结果排序，sort参数指定排序的字段，并使用** 1 和 -1 **来指定排序的方式，分别表示**升序和降序**排列，例如
```
db.icsQCResultItems.find().sort({sessionDate:-1})
```

### 条件操作符
常用的条件操作符包括比较运算符、AND、OR、IN、NOT IN和存在等，具体如下

| 操作符 | 语法 | 示例 |
| :----: | :----: | :----: |
| 等于 | `{<key>:<value>}` | db.icsQCResultItems.find({sessionid:'0000676011-6-190507150703416'}) |
| 小于 | `{<key>:{$lt:<value>}}` | db.icsQCResultItems.find({ sessionDate: { $lt: new Date('2020-12-01') } }).count() |
| 小于或等于 | `{<key>:{$lte:<value>}}` | db.icsQCResultItems.find({ sessionDate: { $lte: new Date('2020-12-01') } }).count() |
| 大于 | `{<key>:{$gt:<value>}}` | db.icsQCResultItems.find({ sessionDate: { $gt: new Date('2020-12-01') } }).count() |
| 大于或等于 | `{<key>:{$gte:<value>}}` | db.icsQCResultItems.find({ sessionDate: { $gte: new Date('2020-12-01') } }).count() |
| 不等于 | `{<key>:{$ne:<value>}}` | db.icsQCResultItems.find({ qcStatus: { $ne: 2 }, sessionDate: { $gt: new Date('2020-12-01') } }).count() |
| AND | `{key1:value1, key2:value2}` | 参考不等于 |
| OR | `{$or: [{key1: value1}, {key2:value2}]}` | db.userGroups.find({$or:[{adminUsers:'5d394aa7773625496523815f'},{users:'5d394aa7773625496523815f'}]}) |
| IN | `{ key: { $in: Array } }` | db.icsQCResultItems.find({sessionid:{$in:['0000676011-6-190507150703416','0000676011-6-190507141656124']}}) |
| NOT IN | `{ key: { $nin: Array } }` | db.icsQCMonitorResult.find({ 'list.type': { $nin: ['EMPLOYEE_SPEED', 'EMPLOYEE_INTERRUPT'] }}).limit(1) |
| EXISTS | `{key:{$exists:true}}` | db.icsQCResultItems.find({ 'qcResultInfo.detail.rId': { $exists: true } }).limit(1) |
| $type操作符 | `{key:{$type:<value>}}` | db.icsQCResultItems.find({qcResult:{$type:"undefined"}}) |

### 高级查询
- 正则匹配查询
```
db.icsQCResultItems.find({orgnName:/秦皇岛/,sessionDate: { $gt: new Date('2020-12-01') } },{orgnName:1,_id:0})
```

- 根据数组字段的长度来查询（$size）
```
db.icsQCResultItems.find({assessClassName:{$size:2}},{assessClassName:1})
```

- 批量更新，关联表更新
```
db.icsQCOp.find({ modifies: { $exists: true }, 'modifies.u': null }).forEach(item => {
    const { _id, modifies } = item
    modifies.u = []
    db.icsQCOp.update({ _id }, { $set: { modifies } })
})
```

- 匹配数组元素（$elemMatch）
```
db.user.find({state_arr:{$elemMatch:{$eq:"123"}}}) 或 db.user.find({state_arr:{$elemMatch:{id:1}}})
```

- 数组字段中新增元素（$addToSet）
```
db.userGroups.update({_id:ObjectId("5bc97d96f88f10542a3726f1")},{$addToSet:{uRules:{$each:[ObjectId("5e391a87081eb4cffca344cf")]}}})
```

- 数组字段中删除元素（$pull）
```
db.uRoles.update({_id: ObjectId("5d551c0557b1632cd9c5343b")},{$pull:{uPermissions:[ObjectId("5ceb45f47e194e7ed1c2f65f"), ObjectId("5cf63f4406485df9287c13c7") ]}})
```

### 聚合查询
MongoDB中聚合查询使用aggregate方法

#### 聚合表达式
$sum、$count、$max

#### 管道操作
管道是指将当前命令的输出结果作为下一个命令的参数，而且管道操作可以重复。

MongoDB聚合查询中常用的管道操作包括：

- $match：用于过滤数据，只输出符合条件的文档
- $project：字段映射，除了输出字段列表外，还可以计算新的字段，类似SQL中的CASE WHEN语句
- $unwind：将文档中的某一个数组o类型字段拆分成多条，每条包含数组中的一个值。
- $group：将集合中的文档分组，可用于统计结果。
- $sort：将输入文档排序后输出。
- $limit：用来限制MongoDB聚合管道返回的文档数。
- $skip：在聚合管道中跳过指定数量的文档，并返回余下的文档。

#### 示例
```js
// 实时监控，统计每个会话触发的报警项总数
let params = { sessionDate: { $gt: new Date('2020-01-01') } }
let fields = ['sessionid', 'app', 'skill', 'userId', 'sessionDate', 'lastServiceName', 'lastServiceId', 'orgnName', 'list']
let $project = fields.reduce((result, name) => {
    result[name] = 1
    return result
}, {})
$project.alarmCount = { $cond: { if: { $eq: [{ $type: '$list.result' }, 'array'] }, then: { $size: '$list.result' }, else: '$list.result' } }

let $match = {
    'list.type': { $nin: ['EMPLOYEE_SPEED', 'EMPLOYEE_INTERRUPT'] },
    '$and': [{ 'list.result': { $ne: [] } }, { 'list.result': { $ne: 0 } }]
}
let $group = { _id: { sessionid: '$sessionid'}, alarmCount: { $sum: 1 } }

db.icsQCMonitorResult.aggregate([
    { $match: params },
    { $unwind: '$list' },
    { $match },
    { $project },
    { $group },
    { $sort: { alarmCount: -1 } },
    { $skip: 0 },
    { $limit: 10 }
])
```

### MongoDB开发
mongodb与javascript是天生的搭档，它不仅更贴近javascript语法，而且还支持ES6的许多特性，例如箭头函数和对象解构赋值等。服务端再结合Node.js，几乎只要会javascript就能搭建起一套Web应用系统

#### [mongoose](http://www.mongoosejs.net/docs/index.html)

mongoose是nodeJS提供连接 mongodb的一个库，它为模型提供了一种直接的，基于scheme结构去定义你的数据模型。它内置数据验证， 查询构建，业务逻辑钩子等，开箱即用

Schema定义示例
```js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ICSQCMonitorItemSchema = new Schema({
  type: String,
  switchStatus: String,
  sensitiveWords: [String],
  speed: Number,
  time: Number,
  timeout: Object,
  ns: String
});

ICSQCMonitorItemSchema.index({ type: 1 }, { unique: true });

module.exports = mongoose.model('ICSQCMonitorItem', ICSQCMonitorItemSchema, 'icsQCMonitorItems');
```

### 参考资料
[MongoDB基本概念和特点](https://www.jianshu.com/p/636ce152fbec)
[MongoDB和MySQL对比（译）](http://ifeve.com/mongodb%E5%92%8Cmysql%E5%AF%B9%E6%AF%94%E8%AF%91/)
[什么场景应该用 MongoDB](https://mongoing.com/archives/3609)

### 进阶
[MongoDB 进阶模式设计](https://mongoing.com/mongodb-advanced-pattern-design)
[NoSQL数据库的战争 – MongoDB和Oracle NoSQL的比较](https://mongoing.com/archives/35123)

### 文档&社区
[mongodb官方文档](https://www.mongodb.com/)
[mongoose中文文档](http://www.mongoosejs.net/)
[MongoDB中文社区](https://mongoing.com/)