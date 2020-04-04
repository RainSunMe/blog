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
运行portainer
```
docker run -d -p 127.0.0.1:5001:9000 --restart=always -v /var/run/docker.sock:/var/run/docker.sock --name prtainer  portainer/portainer
```
运行mongodb
```
// pi
docker run -d --name rpi-mongodb3 -v /home/pi/db/mongo:/data/db -p 27017:27017 --network=lacus casualsimulation/rpi-mongodb3 mongod --auth
// al
docker run -d --name mongo -v /root/db/mongo:/data/db -p 127.0.0.1:5000:27017 --network=lacus mongo mongod --auth
```
打包
```
// al ccb wL2wG2aD6aI1
docker build -t lacus/ccb_backend:1.0 .
// al yg zV1pL8sP4nQ1
docker build -t lacus/yg_backend:1.0 .
// al coc qlSfefSor5
docker build -t lacus/coc_backend:1.0 .
// al ccb frontEnd
docker build -t lacus/ccb_frontend:1.0 .
```
运行
```
// al ccb
docker run -it --name ccb -v /root/data/ccb/docker/logs:/app/logs -p 127.0.0.1:5002:80 --network=lacus lacus/ccb_backend:1.0 /bin/sh
// al yg
docker run -it --name yg -v /root/data/yg/docker/logs:/app/logs -v /root/data/yg/docker/upload:/app/upload -p 127.0.0.1:5003:80 --network=lacus lacus/yg_backend:1.0 /bin/sh
// al coc
docker run -it --name coc -v /root/data/coc/docker/logs:/app/logs -v /root/data/coc/docker/upload:/app/upload -p 127.0.0.1:5004:80 --network=lacus lacus/coc_backend:1.0 /bin/sh
// al ccb frontEnd
docker run -d --name ccb_frontend -p 127.0.0.1:5005:80 --network=lacus lacus/ccb_frontend:1.0
// pi ccb frontEnd
docker run -d --name ccb_frontend -p 127.0.0.1:5003:80 --network=lacus lacus/ccb_frontend:1.0
// pi ccb backEnd
docker run -it --name ccb -v /home/pi/data/ccb/docker/logs:/app/logs -p 127.0.0.1:5002:80 --network=lacus lacus/ccb_backend:1.0 /bin/sh
```