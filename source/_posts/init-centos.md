---
title: 阿里云服务器初始化
date: 2020-3-30 21:23:42
tags: [linux, 命令]
categories: [系统, 部署新服务器]
index_img: /img/linux-title.jpg
banner_img: /img/linux.png
---
# 初始化服务器
因为是阿里的服务器，装的centos8，已经自己换好阿里的镜像源了，很nice
更新`yum`
```
sudo yum -y update
```
Todo
1. [x] nginx
2. [ ] mongodb 
3. [ ] docker
4. [x] htop
## 安装nginx
使用`yum`安装
```
sudo yum -y install nginx   # 安装 nginx
sudo yum remove nginx  # 卸载 nginx
```
配置`nginx`服务
```
sudo systemctl enable nginx # 设置开机启动
sudo service nginx start # 启动nginx服务
sudo service nginx stop # 停止nginx服务
sudo service nginx restart # 重启nginx服务
sudo service nginx reload # 重新加载配置，一般是在修改过nginx配置文件时使用
```
## 安装htop
使用`yum`安装
```
yum install epel-release -y
yum install htop -y
```
## 安装docker
[网页链接](https://docs.docker.com/install/linux/docker-ce/centos/)
如果报错`package docker-ce-3:19.03.8-3.el7.x86_64 requires containerd.io >= 1.2.2-3, but none of the providers can be installed`
就执行以下命令
```
dnf install https://download.docker.com/linux/centos/7/x86_64/stable/Packages/containerd.io-1.2.6-3.3.el7.x86_64.rpm
sudo yum install docker-ce docker-ce-cli
sudo systemctl start docker
```