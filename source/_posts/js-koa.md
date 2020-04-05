---
title: Koa学习笔记
tags: [js, Web后端]
categories: [框架, koa]
index_img: /img/koa-title.jpg
banner_img: /img/koa.jpg
date: 2020-04-05 10:45:00
---
# 应用
## 安装
```
cnpm install koa --save
```
## hello-world
```js
const Koa = require('koa');
const app = new Koa();

app.use(async ctx => {
  ctx.body = 'Hello World';
});

app.listen(3000);
```
## 中间件
使用yield以及next,当一个中间件调用`next()`函数时，函数挂起并控件传递给定义的下一个中间件。在没有更多的中间件执行下游之后，堆栈将退出，并且每个中间件被恢复以执行其上游行为。
```js
const Koa = require('koa');
const app = new Koa();

const one = (ctx, next) => {
  console.log('>> one');
  next();
  console.log('<< one');
}

const two = (ctx, next) => {
  console.log('>> two');
  next();
  console.log('<< two');
}

const three = (ctx, next) => {
  console.log('>> three');
  next();
  console.log('<< three');
}

app.use(one);
app.use(two);
app.use(three);

app.listen(3000);

/*
>> one
>> two
>> three
<< three
<< two
<< one
>> one
>> two
>> three
<< three
<< two
<< one
*/
```
## 配置
应用配置是 app 实例属性，目前支持的配置项如下
- app.env node运行环境，默认为 NODE_ENV or "development"
- app.proxy 表示是否开启代理信任开关,默认为false，如果为 true，则解析 "Host" 的 header 域，对于获取request请求中的host，protocol，ip分别优先从Header字段中的[X-Forwarded-Host](https://cloud.tencent.com/developer/section/1190030)，X-Forwarded-Proto，X-Forwarded-For获取
- app.subdomainOffset 表示子域名是从第几级开始的，这个参数决定了request.subdomains的返回结果，默认值为2，表示 .subdomains 所忽略的字符偏移量。
```js
//比如有netease.youdata.163.com域名
app.subdomainOffset = 2;
console.log(ctx.request.subdomains);  //返回["youdata", "netease"]
app.subdomainOffset = 3;
console.log(ctx.request.subdomains);  //返回["netease"]
//koa获取subdomains的源码
get subdomains() {    
  const offset = this.app.subdomainOffset;    
  const hostname = this.hostname;    
  if (net.isIP(hostname)) return [];    
  return hostname
      .split('.')
      .reverse()
      .slice(offset);
}
```

## app.listen(...)
`app.listen(...)` 实际上是以下代码的语法糖
```js
http.createServer(app.callback()).listen(3000);
```
这意味着您可以同时支持 **HTTP** 和 **HTTPS**，或者在多个端口监听同一个应用
```js
const http = require('http');
const https = require('https');
const Koa = require('koa');
const app = new Koa();
http.createServer(app.callback()).listen(3000);
https.createServer(app.callback()).listen(3001);
```
## app.callback()
返回一个适合 `http.createServer()` 方法的回调函数用来处理请求。 您也可以使用这个回调函数将您的app挂载在 Connect/Express 应用上。
```js
//koa的callback函数实现源码
function callback() {    
  const fn = compose(this.middleware);   //koa-compose包负责将多个中间件组装成一个中间件
  if (!this.listeners('error').length) this.on('error', this.onerror);    
  const handleRequest = (req, res) => {      
    const ctx = this.createContext(req, res);  //这个函数负责生成中间件接收器ctx，绑定一些对象的关联关系
      return this.handleRequest(ctx, fn);  //使用中间件函数fn处理路由请求
    };    
    return handleRequest;
  }
  //handleRequest函数的源码实现也很简单，执行中间件函数，并做一些返回处理和异常处理
  function handleRequest(ctx, fnMiddleware) {    
    const res = ctx.res;
    res.statusCode = 404;    
    const onerror = err => ctx.onerror(err);    
    const handleResponse = () => respond(ctx);
    onFinished(res, onerror);    
    return fnMiddleware(ctx).then(handleResponse).catch(onerror);
  }
```
## app.use(function)
use函数主要作用是给app.middleware数组中添加中间件
## app.keys=
该密钥会被传递给KeyGrip, 当然，您也可以自己生成 KeyGrip. 例如:
```js
app.keys = ['im a newer secret', 'i like turtle'];
app.keys = new KeyGrip(['im a newer secret', 'i like turtle'], 'sha256');
```
在进行cookie签名时，只有设置 signed 为 true 的时候，才会使用密钥进行加密：
```js
ctx.cookies.set('name', 'tobi', { signed: true });
```
## app.context
app.context是从中创建ctx的原型。 可以通过编辑app.context向ctx添加其他属性。当需要将ctx添加到整个应用程序中使用的属性或方法时，这将会非常有用。这可能会更加有效（不需要中间件）和/或更简单（更少的require()），而不必担心更多的依赖于ctx，这可以被看作是一种反向模式。

例如，从ctx中添加对数据库的引用：
```js
app.context.db = db();

app.use(async ctx => {
  console.log(ctx.db);
});
```
> ctx上的很多属性是被限制的，在app.context只能通过使用Object.defineProperty()来编辑这些属性（不推荐）。可以在 https://github.com/koajs/koa/issues/652上查阅
> 已安装的APP沿用父级的ctx和配置。因此，安装的应用程序只是一组中间件。
## 错误处理
默认情况下Koa会将所有错误信息输出到 stderr， 除非 app.silent 是 true.当err.status是404或者err.expose时，默认错误处理程序也不会输出错误。要执行自定义错误处理逻辑，如集中式日志记录，您可以添加一个"错误"事件侦听器：
```js
app.on('error', err => {
  log.error('server error', err)
});
```
如果错误发生在 请求/响应 环节，并且其不能够响应客户端时，Contenxt 实例也会被传递到 error 事件监听器的回调函数里。
```js
app.on('error', (err, ctx) => {
  log.error('server error', err, ctx)
});
```
当发生错误但仍能够响应客户端时（比如没有数据写到socket中），Koa会返回一个500错误(Internal Server Error)。 无论哪种情况，Koa都会生成一个应用级别的错误信息，以便实现日志记录等目的。
# Context(上下文)
在每个`requset`请求中被创建，在中间件中作为接收器(receiver)来引用
```js
app.use(async ctx => {
  ctx; // is the Context
  ctx.request; // is a koa Request
  ctx.response; // is a koa Response
});
```
## API
Context 详细的方法和访问器。
### ctx.req
**Node** 的 request 对象。
### ctx.res
**Node** 的 response 对象
> Koa 不支持 直接调用底层 res 进行响应处理。请避免使用以下 node 属性：
> res.statusCode
> res.writeHead()
> res.write()
> res.end()
### ctx.request
**Koa** 的 Request 对象。
### ctx.response
**Koa** 的 Response 对象。
### ctx.state
推荐的命名空间，用于通过中间件传递信息到前端视图`ctx.state.user = await User.find(id);`
### ctx.app
应用实例引用。
### ctx.cookies.get(name, [options])
获得 **cookie** 中名为 **name** 的值，options 为可选参数;signed 如果为 true，表示请求时 cookie 需要进行签名。
> 注意：Koa 使用了 Express 的 cookies 模块，options 参数只是简单地直接进行传递。
### ctx.cookies.set(name, value, [options])
设置 cookie 中名为 name 的值，options 为可选参数：
  - maxAge 一个数字，表示 Date.now()到期的毫秒数
  - signed 是否要做签名
  - expires cookie有效期
  - pathcookie 的路径，默认为 '/'
  - domain cookie 的域
  - secure false 表示 cookie 通过 HTTP 协议发送，true 表示 cookie 通过 HTTPS 发送。
  - httpOnly true 表示 cookie 只能通过 HTTP 协议发送
  - overwrite 一个布尔值，表示是否覆盖以前设置的同名的Cookie（默认为false）。 如果为true，在设置此cookie时，将在同一请求中使用相同名称（不管路径或域）设置的所有Cookie将从Set-Cookie头部中过滤掉。

### ctx.throw([status], [msg], [properties])
抛出包含 .status 属性的错误，默认为 500。该方法可以让 Koa 准确的响应处理状态。 Koa支持以下组合： 
```js
ctx.throw(400);
ctx.throw(400, 'name required');
ctx.throw(400, 'name required', { user: user });
//该对象被合并到错误中，这对装饰机器友好错误非常有用，并且这些错误会被报给上层请求。
```
this.throw('name required', 400) 等价于：
```js
const err = new Error('name required');
err.status = 400;
err.expose = true;
throw err;
```
> 注意：这些用户级错误被标记为 err.expose，其意味着这些消息被准确描述为对客户端的响应，而并非使用在您不想泄露失败细节的场景中。
### ctx.assert(value, [status], [msg], [properties])
当!value时， Helper 方法抛出一个类似.throw()的错误。 类似node's assert() 方法。 
```js
ctx.assert(ctx.state.user, 401, 'User not found. Please login!');
```
koa 使用 [http-assert](https://github.com/jshttp/http-assert) 来[断言](https://www.runoob.com/w3cnote/c-assert.html)。
### ctx.respond
为了避免使用 Koa 的内置响应处理功能，您可以直接赋值 this.repond = false;。如果您不想让 Koa 来帮助您处理 reponse，而是直接操作原生 res 对象，那么请使用这种方法。
> 注意： 这种方式是不被 Koa 支持的。其可能会破坏 Koa 中间件和 Koa 本身的一些功能。其只作为一种 hack 的方式，并只对那些想要在 Koa 方法和中间件中使用传统 fn(req, res) 方法的人来说会带来便利。
### Request aliases
ctx会代理ctx.response和ctx.request上的一些属性和函数(这个代理逻辑是在ctx.response和ctx.request的原型上实现的)
```js
//以下是koa源码（method表示代理方法，access表示代理属性可读可写，getter表示代理属性可读）：
delegate(proto, 'response')
  .method('attachment') //将Content-Disposition 设置为 “附件” 以指示客户端提示下载
  .method('redirect') //返回重定向，如果没有code设置，默认设置code为302
  /*
    // 字符串 "back" 是一个特殊参数，其提供了 Referrer 支持。当没有Referrer时，使用 alt 或者 / 代替。
    ctx.redirect('back');
    ctx.redirect('back', '/index.html');
    ctx.redirect('/login');
    ctx.redirect('http://google.com');
  */
  .method('remove')   //删除响应头的某个属性
  .method('vary')  //设置Vary响应头
  .method('set') //设置响应头，可以传递对象，数组，单个值的形式
  .method('append') //给response.headers中的某个key值追加其它value
  .method('flushHeaders')  //执行this.res.flushHeaders()
  .access('status')  //http返回code码，优先选择用户的设置，如果用户没有主动设置，而设置了ctx.body的值， 如果设置值为null，则返回204，如果设置值不为null，那么返回200，否则默认情况下是404
  .access('message')  //获取响应的状态消息. 默认情况下, response.message 与 response.status 关联
  .access('body')   //response的返回结果
  .access('length')  //response的headers的Content-Length，可以自己设置，默认根据body二进制大小设置
  .access('type')   //设置响应的content-type
  .access('lastModified')  //设置响应头Last-Modified
  .access('etag')  //设置包含 " 包裹的 ETag 响应头
  .getter('headerSent')  //检查是否已经发送了一个响应头。 用于查看客户端是否可能会收到错误通知
  .getter('writable');   //返回是否可以继续写入delegate(proto, 'request')
  .method('acceptsLanguages')
  .method('acceptsEncodings')
  .method('acceptsCharsets')
  .method('accepts')        //accepts函数用于判断客户端请求是否接受某种返回类型
  .method('get')   //获取请求头中的某个属性值
  .method('is')  //判断请求头希望返回什么类型
  /*
    检查请求所包含的 "Content-Type" 是否为给定的 type 值。 如果没有 request body，返回 undefined。 如果没有 content type，或者匹配失败，返回 false。 否则返回匹配的 content-type。
    // With Content-Type: text/html; charset=utf-8
    ctx.is('html'); // => 'html'
    ctx.is('text/html'); // => 'text/html'
    ctx.is('text/*', 'text/html'); // => 'text/html'

    // When Content-Type is application/json
    ctx.is('json', 'urlencoded'); // => 'json'
    ctx.is('application/json'); // => 'application/json'
    ctx.is('html', 'application/*'); // => 'application/json'

    ctx.is('html'); // => false
    //比如说您希望保证只有图片发送给指定路由
    if (ctx.is('image/*')) {
      // process
    } else {
      ctx.throw(415, 'images only!');
    }
  */
  .access('querystring') //获取原始查询字符串
  .access('idempotent')
  .access('socket') //返回请求套接字
  .access('search') //搜索字符串
  .access('method')  //请求方法
  .access('query')  //获取请求的查询字符串对象
  .access('path')  //获取请求路径名
  .access('url')  //请求的url,该url可以被重写
  .getter('origin')  //获取url的来源：包括 protocol 和 host（http://example.com）
  .getter('href') //获取完整的请求URL，包括 protocol，host 和 url（http://example.com/foo/bar?q=1）
  .getter('subdomains') //以数组形式返回子域名  
  /* 举例来说，如果域名是 "tobi.ferrets.example.com":
    如果没有设置 app.subdomainOffset，其 subdomains 为 ["ferrets", "tobi"]。 如果设置 app.subdomainOffset 为3，其 subdomains 为 ["tobi"]
  */
  .getter('protocol') //返回请求协议
  .getter('host') //获取当前主机的host(hostname:port)
  .getter('hostname') //获取当前主机的host
  .getter('URL') //获取 WHATWG 解析的 URL 对象
  .getter('header') //返回请求头对象
  .getter('headers')  //返回请求头对象
  .getter('secure') //通过 ctx.protocol == "https" 来检查请求是否通过 TLS 发出
  .getter('stale') 
  .getter('fresh') //检查请求缓存是否 "fresh"(内容没有发生变化)。该方法用于在 If-None-Match / ETag, If-Modified-Since 和 Last-Modified 中进行缓存协调。当在 response headers 中设置一个或多个上述参数后，该方法应该被使用。
  .getter('ips')  //当 X-Forwarded-For 存在并且 app.proxy 被启用时，这些 ips 的数组被返回
  .getter('ip'); //请求远程地址
//比如以下操作是等价的：
ctx.body = {
  code: 200,
  result: {
      nick: "zhangdianpeng"
  }
}

ctx.response.body = {
    code: 200,
    result: {
        nick: "zhangdianpeng"
    }
}
console.log('ctx.method:', ctx.method);
console.log('ctx.request.method:', ctx.request.method);
/*
作者：网易云社区
链接：https://www.jianshu.com/p/20cf1c476d22
来源：简书
改进：RainSun
*/
```
# 使用Make构建网站
[阮一峰教程](http://www.ruanyifeng.com/blog/2015/03/build-website-with-make.html)