---
date: 2019-11-30 20:36:53
title: linux 命令积累
tags: [system, linux, 命令]
categories: [系统, linux]
index_img: /img/linux-title.jpg
banner_img: /img/linux.png
---

#  linux
### 切换用户`su - root` 
  * `-` 的含义是携带当前环境变量

### 增加用户`useradd` 
  * `-g` 指定用户所在群组 
  * `-m` 自动建立用户的登入目录 
  * `-n` 取消建立和用户同名的群组

### 更改对应用户密码`passwd`

### 查看进程`ps`  
  * `-ef` 查看所有进程以及其pid 
  * `-aux` 查看所有进程并显示其占用的cpu以及mem 
  * `-w` 显示加宽可以显示更多信息
  * `ps -auxwww`加宽三次

### 停止进程`kill (pid)`
  * `-s` 发送指定信号到进程
  * `-p` 打印出进程号，但是不发送信号
  * `-l` 打印出所有可用信号名称

### 查看磁盘`fdisk -l`
  * 必须使用`root`权限

### 切换目录`cd ../`
  * `./`当前目录
  * `../`上级目录
  * `cd -`返回到上个目录

### 显示当前文件夹下的文件夹以及文件`ls`
  * `-l` 显示详细信息
  * `-a -all` 列出所有文件包括隐藏文件
  * `-d` 将目录名和其他文件一样列出，而不是列出目录的内容
  * `-f` 不排序目录内容，按他们在磁盘上存储的顺序列出

### 创建一个目录`mkdir`
  * `-m` 对新建目录设置权限
  * `-p` 可以是一个路径，可以一次创建多层目录

### 查看文件内容`cat (文件路径)`
  * `-n` 输出行号
  * `-b` 输出行号，对空白行不编号

### 复制文件`cp`
  * `-a` 保留链接，文件属性，复制其子目录，其作用等于dpr选项的组合
  * `-d` 拷贝时保留链接
  * `-f` 删除已经存在的目标文件而不提示
  * `-i` 覆盖目标文件之前给出提示要求用户确认
  * `-p` 除了复制内容，修改时间还有访问权限也复制到新文件中
  * `-r` 若给出的文件是一目录文件，此时将会递归复制该目录下的所有文件以及子目录，此时目标文件必须为一个目录名

### 为文件改名或者移动`mv`
  *  `-i` 若操作会导致文件被覆写，将会提示用户确认
  *  `-f` 禁止交互 会让`-i` 失效
  *  `mv fromfile tofile`如把文件a.txt得命名为b.txt，可以是mv a.txt b.txt。
  
### 移除目录或者文件`rm`
  * `-i` 进行交互式删除
  * `-f` 不需要提示
  * `-r` 将所有目录以及子目录递归地删除
  * `-d` 删除空目录

### 修改文件所有者`chown`

### 修改文件所有组`chgrp`

### 修改文件访问权限`chmod`
  * `-c` 若文件权限更改成功才显示
  * `-f` 若文件无法被更改也不打印错误信息
  * `-v` 显示权限变更详细资料
  * 修改文件权限[链接]('https://blog.csdn.net/slwhy/article/details/78876237')

### 在指定文件中搜索内容
  * `grep` 选项 格式 文件
  * `-c` 只输出匹配的行数
  * `-i` 不区分大小写
  * `-h` 查询多文件不显示文件名
  * `-l` 查询多文件只显示包含匹配字符的文件名
  * `-n` 显示匹配行以及行号
  * `-s` 不显示不存在或者无匹配文本的错误信息
  * `-v` 显示不包含匹配文本的所有行

### 查找指定文件`find [路径] [选项] [描述]`
  * `-depth` 使用深度级别的查找过程方式，在某层指定目录中优先查找文件内容
  * `-mount` 不在其他文件系统的目录个文件中查找
  * `-name` 支持通配符* 和 ?
  * `-user` 搜索文件所属为用户名的文件
  * `-print` 输出搜索结果并打印
  * `-and` 把两个查找参数链接起来

### 查找文件`locate`
  * 先建立一个所有文件名以及路径的数据库所以比find快
  * `-u` 从根目录开始建立数据库
  * `-U` 从指定位置开始建立数据库
  * `-f` 将特定的文件系统排除在数据库外
  * `-r` 使用正则表达式做寻找的条件
  * `-o` 指定数据库的名成
  * 创建后会在crontab中每天已更新
  * 使用updatedb强制更新

### 创建链接`ln -s ../genromfs-0.5.1.tar.gz ./hello`

### gzip压缩解压
  * 自动识别
  * `-c` 将输出信息输出保留源文件
  * `-d` 将压缩文件解压，但是不能压缩目录
  * `-l` 显示详细信息
  * `-r` 查找指定目录压缩或解压缩里边所有文件
  * `-t` 测试，检查压缩文件是否完整
  * `-v` 对每一个压缩或者解压的文件显示文件名和压缩比

### 对文件目录进行打包和解包`tar`
  * `tar [选项] [打包后文件名] 文件目录列表`
  * `-c` 建立新的打包文件
  * `-r` 向打包文件末尾追加文件
  * `-x` 从打包文件中解出文件
  * `-o` 将文件解开到标准输出
  * `-v` 显示处理过程中相关信息
  * `-f` 对普通文件操作
  * `-z` 调用gzip压缩打包文件，与`-x`连用解压缩
  * `-j` 调用bzip2压缩打包文件，与`-x`连用解压缩
  * `-Z` 调用Compress压缩打包文件，与`-x`连用解压缩

### 查看网络状态`ifconfig`

### 系统服务命令`chkconfig --list`
  * 查看指定命令 `chkconfig --list|grep ntpd`
  * 操作指定服务 `chkconfig --level 3 ntpd on`

### 查看当前文件夹`pwd`
  
### 查看所有端口占用情况
`netstat -ntlp`

### 创建文件
`touch`

### 查看 5000端口占用程序
`sudo lsof -i:5000`

### 停止进程
`sudo kill (PID)`

### 下载到当前文件夹
`wget"<url>"`

### 下载到 /home/omio/Desktop
`wget -P /home/omio/Desktop/"<url>"`

### 下载并重命名为NewFileName
`wget -O /home/omio/Desktop/NewFileName"<url>"`

### 压缩
`zip -r archive_name.zip directory_to_compress`

### 解压缩
`unzip archive_name.zip`

### 打包
`tar -cvf archive_name.tar directory_to_compress`

### 解包
`tar -xvf archive_name.tar.gz`

### 压缩
`tar -zcvf archive_name.tar.gz directory_to_compress`

### 解压缩
`tar -zxvf archive_name.tar.gz`

`tar -zxvf archive_name.tar.gz -C /tmp/extract_here/`

### 重命名
`mv fromfile tofile`
* 如把文件a.txt得命名为b.txt，可以是mv a.txt b.txt。

### 删除一个空目录
`rm -d 目录名`

### 删除一个空目录
`rm -dir 目录名`

### 删除一个非空目录
`rm -r 目录名`

### 删除文件
`rm 文件名`

### 修改文件权限
[链接]('https://blog.csdn.net/slwhy/article/details/78876237')

* sudo chmod o+rwx /usr/local/bin/sunny