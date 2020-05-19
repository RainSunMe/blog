---
title: docker学习笔记
date: 2020-4-1 21:23:42
tags: [linux, docker]
categories: [工具, docker]
index_img: /img/docker-title.jpg
banner_img: /img/docker.jpg
---
# docker
查看全部网桥
```
docker network ls
```
查看某个网桥
```
docker network inspect <name>
```
创建一个名为`lacus`的网桥
```
docker network create --driver bridge lacus
```
允许指定网段 上一句指定参数在名之前
```
--subnet 172.22.16.0/24 --gateway 172.22.16.1
```
删除`lacus`网桥
```
docker network rm lacus
```
连接到`lacus`网桥
```
--network=lacus
```
---
## 容器间通信的三种方式
**IP通信**

只要放在了一个网桥下就可以通过ip进行访问了

**Docker DNS Server**

docker内嵌了DNS Server，只要使用`--name=<name>`指定容器名并且绑定在一个网桥中就可以使用名字`ping -c 3 name`连通
> 使用 docker DNS 有个限制：只能在 user-defined 网络中使用。

**joined 容器**

通过`--network=container:<name>`指定`jointed`容器

## 实例
**运行portainer**
```
docker run -d -p 127.0.0.1:5001:9000 --restart=always -v /var/run/docker.sock:/var/run/docker.sock --name prtainer  portainer/portainer
```
**运行mongodb**
```
// pi
docker run -d --name mongo -v /home/pi/db/mongo:/data/db -p 27017:27017 --restart=always --network=lacus casualsimulation/rpi-mongodb3 mongod --auth
// al
docker run -d --name mongo -v /root/db/mongo:/data/db -p 127.0.0.1:5000:27017 --restart=always --network=lacus mongo mongod --auth
```
**打包**
```
// al tracer_backend
docker build -t lacus/tracer_backend:1.0 .
// al tracer_user
docker build -t lacus/tracer_user:1.0 .
// al tracer_admin
docker build -t lacus/tracer_admin:1.0 .

// al canary_backend
docker build -t lacus/canary_backend:1.0 .
// al canary_frontend
docker build -t lacus/canary_frontend:1.0 .

// al cherry_backend
docker build -t lacus/cherry_backend:1.0 .
// al cherry_frontend
docker build -t lacus/cherry_frontend:1.0 .
```
**运行**
```
// al tracer_backend
docker run -it --name tracer_backend -v /root/data/tracer/backEnd/logs:/app/logs -v /root/data/tracer/backEnd/upload:/app/upload -p 127.0.0.1:5002:80 --network=lacus lacus/tracer_backend:1.0 /bin/sh
// al tracer_user
docker run -d --name tracer_user -p 127.0.0.1:5003:80 --restart=always --network=lacus lacus/tracer_user:1.0
// al tracer_admin
docker run -d --name tracer_admin -p 127.0.0.1:5004:80 --restart=always --network=lacus lacus/tracer_admin:1.0

// al canary_backend
docker run -it --name canary_backend -v /root/data/canary/backEnd/logs:/app/logs -p 127.0.0.1:5005:80 --network=lacus lacus/canary_backend:1.0 /bin/sh
// al canary_frontend
docker run -d --name canary_frontend -p 127.0.0.1:5006:80 --restart=always --network=lacus lacus/canary_frontend:1.0

// al cherry_backend
docker run -it --name cherry_backend -v /root/data/cherry/backEnd/logs:/app/logs -p 127.0.0.1:5007:80 --network=lacus lacus/cherry_backend:1.0 /bin/sh
// al cherry_frontend
docker run -d --name cherry_frontend -p 127.0.0.1:5008:80 --restart=always --network=lacus lacus/cherry_frontend:1.0

// pi ccb frontEnd
docker run -d --name ccb_frontend -p 127.0.0.1:5003:80 --restart=always --network=lacus lacus/ccb_frontend:1.0
// pi ccb backEnd
docker run -it --name ccb -v /home/pi/data/ccb/docker/logs:/app/logs -p 127.0.0.1:5002:80 --restart=always --network=lacus lacus/ccb_backend:1.0 /bin/sh

// vueview
 docker run  -d --name canary_frontEnd -p 127.0.0.1:5006:80 --restart=always -v /root/data/canary/frontEnd:/vue lacus/vueview
 // flask_env
 docker run -it --name phonebook_backend -p 127.0.0.1:5011:80 -v /root/data/phonebook/backEnd:/app --network=lacus lacus/flask_env /bin/sh
```