#!/usr/bin/env node
var fs = require('fs');
var file = require(process.cwd()+'/package.json');
var myDate=new Date();
var y,m,d;
y=myDate.getFullYear()-2016;
m=myDate.getMonth()+1;
d=myDate.getDate();
file.version=y+'.'+m+'.'+d;
var destString = JSON.stringify(file,null, 2);
fs.writeFile(process.cwd()+'/package.json', destString);
