---
title: 树莓派3b安装gogs
tags: [树莓派3b, gogs]
categories: [树莓派3b, gogs]
index_img: /img/gogs-title.jpg
banner_img: /img/pi.jpg
date: 2019-11-30 20:55:09
---
# gogs

创建新用户git 如果不创建会导致主账号登陆不了ssh

切换为root用户为了获取创建用户的权限

`sudo su`

给root创建一个新的密码

`sudo passwd root`

添加一个新用户（如用户名为git）

`useradd git`

为该用户设定登录密码

`passwd git`

为该用户指定命令解释程序（通常为/bin/bash）

`usermod -s /bin/bash git`

为该用户指定用户主目录

`usermod -d /home/git git`

查看用户的属性

`cat /etc/passwd`

切换到用户git

`su git`

再次切换到root用户（不要用sudo su, 而用su root）

`su root`

执行visudo命令

`visudo`

该命令实际上打开的是/etc/sudoers文件，修改该文件，在“root ALL=(ALL:ALL) ALL”这一行下面加入一行：

`git ALL=(ALL:ALL) ALL`

ctrl+o（然后再按enter）保存，ctrl+c取消，ctrl+x退出

---

下载
`wget 'https://github.com/gogs/gogs/releases/download/v0.11.91/raspi_armv7.zip'`

解压
`unzip raspi_armv7.zip`

进文件夹
`cd gogs`

开启web服务
`./gogs web`

去3000端口进行设置，数据库设置成sqlite就行

在`/etc/systemd/system/gogs.service`新建文件
```
[Unit]
Description=Gogs (Go Git Service)
After=syslog.target
After=network.target
#After=mysqld.service
#After=postgresql.service
#After=memcached.service
#After=redis.service

[Service]
# Modify these two values and uncomment them if you have
# repos with lots of files and get an HTTP error 500 because
# of that
###
#LimitMEMLOCK=infinity
#LimitNOFILE=65535
Type=simple
User=git
Group=git
WorkingDirectory=/home/git/gogs
ExecStart=/home/git/gogs/gogs web
Restart=always
Environment=USER=git HOME=/home/git

[Install]
WantedBy=multi-user.target
```

更新 User、Group、WorkingDirectory、ExecStart 和 Environment 为相对应的值。其中 WorkingDirectory 为您的 Gogs 实际安装路径根目录。

[可选] 如果您 Gogs 安装示例使用 MySQL/MariaDB、PostgreSQL、Redis 或 memcached，请去掉相应 After 属性的注释。

然后通过 `sudo systemctl enable gogs` 命令激活，最后执行 `sudo systemd start gogs`，就可以做到开机启动了。

官方文件解释[docs]('https://gogs.io/docs/advanced/configuration_cheat_sheet')

重启 `sudo systemctl restart gogs`
