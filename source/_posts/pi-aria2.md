---
title: 树莓派3b安装aria2
tags: [树莓派3b, aria2]
categories: [树莓派3b, aria2]
index_img: /img/aria2-title.jpg
banner_img: /img/pi.jpg
date: 2020-04-04 11:02:09
---
# aria2
## 安装`aria2`
```
sudo apt-get install aria2
```
## 配置`aria2`的文件
```
mkdir ~/.aria2
touch ~/.aria2/aria2.session
mkdir /home/pi/data/aria2
mkdir /home/pi/data/aria2/download
nano ~/.aria2/aria2.conf
```
`conf`文件里边写
```
dir=/home/pi/data/aria2/download
disable-ipv6=true
enable-rpc=true
rpc-allow-origin-all=true
rpc-listen-all=true
continue=true
input-file=/home/pi/.aria2/aria2.session
save-session=/home/pi/.aria2/aria2.session 
max-concurrent-downloads=5
save-session-interval=60
peer-id-prefix=-TR2770-
user-agent=Transmission/2.77
bt-seed-unverified=true
bt-save-metadata=true
```
测试运行看看有没有错误
```
aria2c –conf-path=/home/pi/.aria2/aria2.conf
```
把它做成系统服务
```
sudo nano /etc/init.d/aria2c
```
输入
```
#!/bin/sh
### BEGIN INIT INFO
# Provides:          aria2
# Required-Start:    $remote_fs $network
# Required-Stop:     $remote_fs $network
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: Aria2 Downloader
### END INIT INFO
 
case "$1" in
start)
 
echo -n "Starting aria2c"
sudo -u pi aria2c --conf-path=/home/pi/.aria2/aria2.conf -D
;;
stop)
 
echo -n "Shutting down aria2c "
killall aria2c
;;
restart)
 
killall aria2c
sudo -u pi aria2c --conf-path=/home/pi/.aria2/aria2.conf -D
;;
esac
exit
```
## 设置权限
```
sudo chmod 755 /etc/init.d/aria2c
```
## 测试服务是否能启动
```
sudo service aria2c start
```
报错就再输入一句
```
sudo update-rc.d aria2c defaults
```
## 添加aria2c服务自动运行
```
sudo update-rc.d aria2c defaults
```
## 进文件夹下载yaaw
```
cd data/aria2
git clone http://github.com/wzhy90/yaaw
```
之后就在teaweb里边设置代理就ok