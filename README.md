## lalm-cli
平时学习、开发、摸鱼时我们会用到各种不同的框架/工具，每次都重新搭建环境是一件费时费力的事情，甚至会本末倒置（写了10行代码，搭了两小时开发环境）。

这个库是一个(简单的)模板下载工具，可以下载并copy你或他人托管在github.com的demo/脚手架。

## 模板库
- 可以下载使用我常用的几个模板， 仓库地址：[lalm-cli-template](https://github.com/liwenjie3421/lalm-cli-template)

- 自己创建
项目目录没有太多要求，只需要有一个`templates`文件夹，然后`lalm-cli`就会遍历该目录下的文件夹，每一个文件夹会被认为是一个模板，可以参考：[lalm-cli-template](https://github.com/liwenjie3421/lalm-cli-template)

## 安装
```
    npm install lalm-cli -g
```

## 使用
下载模板使用了[flipxfx/download-git-repo](https://github.com/flipxfx/download-git-repo)，所以目录地址可以参照[flipxfx/download-git-repo](https://github.com/flipxfx/download-git-repo)的使用说明，最简单的方式是直接写入项目名：

```
    lalm <github名/仓库名> new-project
```

## 最后
enjoy it

## License
MIT