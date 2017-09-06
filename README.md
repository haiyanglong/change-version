# change-version（更改版本号）
安装使用:
<pre><code>npm install -g change-version</code></pre>
参数：
<pre><code>
  Usage: change-version [options]

  //set version and change your package.json file


  Options:

    -V, --version      //output the version number输出版本号
    -sv, --sv <sv>     //your version设置你的版本号，如果没传将默认为当前年月日生成的版本号，并更改package.json中的version参数值
                       //如：2017.9.5生成的版本号为1.9.5,2018.9.5生成的版本号为2.9.5，如果自己传参时带有这个参数将以参数值替代版本号
    -db, --db [db]     //is set docker-build version是否设置docker-build命令中的版本号，这是为了自己项目的需要设置的可以不传
    -evn, --evn [evn]  //your evn你的运行环境，这也是自己项目需要的设置可以不传
    -h, --help         //output usage information帮助文档
</code></pre>
