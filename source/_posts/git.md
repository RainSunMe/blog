---
title: git常用命令总结
date: 2019-11-30 20:44:42
tags: [git, 命令]
categories: [工具, git]
index_img: /img/git-title.jpg
banner_img: /img/default.png
---
# git

* SSH `C:\Users\yingbo\.ssh`
  * 创建： `ssh-keygen -t rsa -C '邮件地址'`
  * 测试： `ssh -T git@github.com`
  * 注意：上面创建语句完成后会让你输入密码，直接回车，不然之后提交的时候每次都会让你输入密码

* `git init` 初始化仓库

* `git status` 查看仓库状态

* `git add '文件名'` 向暂存区添加文件，如果添加所有文件，'文件名' => *

* `git commit -m 'text'` 
  * 提交，text为提交描述
  * 直接 `git commit`会进入详细编辑的界面
    * 第一行简介
    * 第二行空行
    * 第三行详情

* `git log` 提交日志
  * 尾缀
    * `--pretty = short` 只显示概要
    * `目录名/文件名` 只显示该目录或者该文件的记录
    * `-P` 显示改动
    * `-P` 文件名 显示该文件的改动

* `git diff` 查看区别
  * `git diff HEAD` 本次与上次的区别

* `git branch` 显示所有分支
  * `git checkout -b name` 创建name分支并进入( 等同于下边两步)
    * => `git branch name`
    * => `git checkout name`
  * `git checkout -` 切换回上一个分支
  * 注：最好每做一件事就创建一个新的分支，保证代码无误再合并到主分支，保障主分支随时可用

* 合并分支
  * `git checkout '合并到的分支名'`
  * `git merge --no--ff '合并后消失的分支名'`
  * `git log --graph` 图表形式提交日志

* `git reset --hard '哈希值'` 回溯历史版本

* `git reflog` 操作日志

* 查看冲突并解决 git merge 后提示有冲突，此时冲突文件会被修改，进文件改成想要的样子，然后git add，git commit，done！

* `git commit --amend` 修改上一条的提交信息

* 压缩历史
  * `git commit -am` 一次性进暂存然后提交
    * 注：修改名称为 typo 例： fix typo
  * `git rebase -i HEAD~2` 合并两次最新提交
  * 进入编辑器
  * pick 7a34294 Add feature-C
  * pick ofba227 Fix typo 将typo -> fixup
  然后保存 -> ok

* 添加远程仓库
  * `git remote add origin '网址'`
  * `git push -u origin master`
  * //将当前分支推送到origin远端的master分支（master不存在的话自动新建）
  * `git clone '网址'` 克隆仓库
  * `git branch -a` 同时显示本地和远端的分支
  * `git checkout -b feature-D origin/feature-D`
  * //新建本地feature-D分支并把远端的feature-D同步过来

* `git fetch` 与 `git pull` 的区别
  * git pull = git fetch + git margin

* 删除分支
  * `git branch -D '分支名'`

* PR总结
  ``` 
  git checkout -b <name> //创建分支
  
  coding...

  git commit -m '<content>' //提交

  git pushd -u origin <name>  //推远端

  web -> pr

  git branch -d <name>  //删除本地

  git push origin --delete <name> //删除远端
  ```