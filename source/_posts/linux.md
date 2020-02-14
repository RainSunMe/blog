---
date: 2019-11-30 20:36:53
title: linux 命令积累
tags: [system, linux, 命令]
categories: [系统, linux]
index_img: /img/linux-title.jpg
banner_img: /img/linux.png
---

# linux

查看所有端口占用情况
`netstat -ntlp`

创建文件
`touch`

查看 5000端口占用程序
`sudo lsof -i:5000`

停止进程
`sudo kill (PID)`

下载到当前文件夹
`wget"<url>"`

下载到 /home/omio/Desktop
`wget -P /home/omio/Desktop/"<url>"`

下载并重命名为NewFileName
`wget -O /home/omio/Desktop/NewFileName"<url>"`

压缩
`zip -r archive_name.zip directory_to_compress`

解压缩
`unzip archive_name.zip`

打包
`tar -cvf archive_name.tar directory_to_compress`

解包
`tar -xvf archive_name.tar.gz`

压缩
`tar -zcvf archive_name.tar.gz directory_to_compress`

解压缩
`tar -zxvf archive_name.tar.gz`

`tar -zxvf archive_name.tar.gz -C /tmp/extract_here/`

重命名
`mv fromfile tofile`
如把文件a.txt得命名为b.txt，可以是mv a.txt b.txt。

删除一个空目录
`rm -d 目录名`

删除一个空目录
`rm -dir 目录名`

删除一个非空目录
`rm -r 目录名`

删除文件
`rm 文件名`

修改文件权限
[链接]('https://blog.csdn.net/slwhy/article/details/78876237')

sudo chmod o+rwx /usr/local/bin/sunny