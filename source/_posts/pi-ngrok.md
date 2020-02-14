---
title: 树莓派3b部署ngrok
tags: [树莓派3b, ngrok]
categories: [树莓派3b, ngrok]
index_img: /img/ngrok-title.png
banner_img: /img/pi.jpg
date: 2019-11-30 21:14:04
---
# ngrok

先去[sunny ngrok](http://www.ngrok.cc/)买个id

下载
`wget 'hls.ctopus.com/sunny/linux_arm.zip?v=2'`

重命名
`mv linux_arm.zip?v=2 linux_arm.zip`

解压缩
`unzip linux_arm.zip`

切文件夹
`cd linux_arm`

启动！
`./sunny clientid <your-clientid>`

后台运行
`setsid ./sunny clientid <your-clientid> &`

移动到 /use/local/bin 目录下并给予可执行权限

```
sudo mv sunny /usr/local/bin/sunny
sudo chmod +x /usr/local/bin/sunny
```

编写启动脚本
`sudo vim /etc/init.d/sunny`

内容
```
#!/bin/sh -e
### BEGIN INIT INFO
# Provides:          ngrok.cc
# Required-Start:    $network $remote_fs $local_fs
# Required-Stop:     $network $remote_fs $local_fs
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: autostartup of ngrok for Linux
### END INIT INFO

NAME=sunny
DAEMON=/usr/local/bin/$NAME
PIDFILE=/var/run/$NAME.pid

[ -x "$DAEMON" ] || exit 0

case "$1" in
  start)
      if [ -f $PIDFILE ]; then
        echo "$NAME already running..."
        echo -e "\033[1;35mStart Fail\033[0m"
      else
        echo "Starting $NAME..."
        start-stop-daemon -S -p $PIDFILE -m -b -o -q -x $DAEMON -- clientid <your-clientid> || return 2
        echo -e "\033[1;32mStart Success\033[0m"
    fi
    ;;
  stop)
        echo "Stoping $NAME..."
        start-stop-daemon -K -p $PIDFILE -s TERM -o -q || return 2
        rm -rf $PIDFILE
        echo -e "\033[1;32mStop Success\033[0m"
    ;;
  restart)
    $0 stop && sleep 2 && $0 start
    ;;
  *)
    echo "Usage: $0 {start|stop|restart}"
    exit 1
    ;;
esac
exit 0
```

测试
```
sudo chmod 755 /etc/init.d/sunny
sudo /etc/init.d/sunny start
sudo /etc/init.d/sunny start    #启动
sudo /etc/init.d/sunny stop     #停止
sudo /etc/init.d/sunny restart  #重启
```

开机启动
```
cd /etc/init.d
sudo update-rc.d sunny defaults 90    #加入开机启动
sudo update-rc.d -f sunny remove  #取消开机启动
```
