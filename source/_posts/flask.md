---
title: Flask 简单安装和部署
tags: [python, flask]
categories: [框架, flask] 
index_img: https://dormousehole.readthedocs.io/en/latest/_images/flask-logo.png
banner_img: /img/flask.jpg
date: 2019-11-30 20:21:00
---
# flask

安装venv

`python3 -m venv venv`

启动venv

`. venv/bin/activate`

关闭venv

`deactivate` 

查看现在已经安装的依赖

`pip3 list`

更新pip

`pip install --upgrade pip`

安装Flask

` pip install Flask`

安装最新的flask

`pip install -U https://github.com/pallets/flask/archive/master.tar.gz`

安装pymongo

` pip install pymongo`

安装requests

` pip install requests`

安装payjs

` pip install payjs`

设置全局变量

`export FLASK_APP=qrcode.py`

`export FLASK_ENV=development`

启动

`flask run --host=0.0.0.0`

在虚拟环境下安装gunicorn 

`pip install gunicorn`

添加配置文件 gunicorn.conf.py

```
# 并行工作线程数
workers = 4
# 监听内网端口5000【按需要更改】
bind = '127.0.0.1:5000'
# 设置守护进程【关闭连接时，程序仍在运行】
daemon = True
# 设置超时时间120s，默认为30s。按自己的需求进行设置
timeout = 120
# 设置访问日志和错误信息日志路径
# accesslog = './logs/acess.log'
# errorlog = './logs/error.log'
# 自动重启
autostart = ture
```

启动gunicorn

`gunicorn qrcode:app -c gunicorn.conf.py`

查询gunicorn

`pstree -ap|grep gunicorn`

停止进程

`kill (pid)`

---

在路由中
1. 同时有user/ 和 user 优先解释 user/
2. 只有 user 的情况下 访问user/会报404
3. 只有 user/ 的情况下 访问user会被重定向