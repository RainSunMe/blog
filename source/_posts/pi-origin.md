---
title: 树莓派3b更换国内软件源
tags: [树莓派3b, 软件源]
categories: [树莓派3b, 软件源]
index_img: /img/ali-title.png
banner_img: /img/pi.jpg
date: 2019-11-30 21:44:00
---
# 更换软件源

1. 切换到root用户
`su - root`

2. 修改 /etc/apt/sources.list
`sudo nano /etc/apt/sources.list`
  
    原文`deb http://mirrordirector.raspbian.org/raspbian/ stretch main contrib non-free rpi` 加#注释掉
    
    加入如下阿里源，`deb http://mirrors.aliyun.com/raspbian/raspbian/ stretch main contrib non-free rpi`

3. 修改/etc/apt/sources.list.d/raspi.list
`sudo nano /etc/apt/sources.list.d/raspi.list`

    原文`deb http://archive.raspberrypi.org/debian/ stretch main ui，` 加#
    
    加入如下科大源：`deb http://mirrors.ustc.edu.cn/archive.raspberrypi.org/debian/ stretch main ui`

4. 更新系统和软件
`sudo apt-get update`

    `sudo apt-get upgrade`

