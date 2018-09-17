#!/usr/bin/env node
var fs = require('fs');
var file = require(process.cwd()+'/package.json');
var localFile=require('./package.json');
var myDate=new Date();
var y,m,d;
y=myDate.getFullYear()-2016;
m=myDate.getMonth()+1;
d=myDate.getDate();
var program = require('commander')
program
    .version(localFile.version)
    .allowUnknownOption()
    .description('set version and change your package.json file')
    .option('-sv, --sv [sv]', 'your version', y+'.'+m+'.'+d)
    .option('-db, --db [db]', 'is set docker-build version', 'false')
    .option('-evn, --evn [evn]', 'your evn', 'prod')
    .option('-name, --name [name]', 'your project name', '')
program.parse(process.argv)
file.version=program.sv;
if(program.db){
    if(!file.config['dockerBuildName']){
        console.log('找不到dockerBuildName参数');
        process.exit(1);
    }else{
        file.config['version']=file.version;
        var dockerCl=file.config['dockerBuildName'];
        if(program.name){
            var star=dockerCl.lastIndexOf('/');
            var str=dockerCl.substring(star+1,dockerCl.length);
            if(program.evn=='test'){
                dockerCl=dockerCl.replace(str,program.name+':'+file.version+'-TEST-RELEASE');
                file.config['dockerBuildName']=dockerCl;
            }else{
                dockerCl=dockerCl.replace(str,program.name+':'+file.version);
                file.config['dockerBuildName']=dockerCl;
            }
        }else{
            var x=dockerCl.indexOf(':');
            var star=dockerCl.indexOf(':',x+1);
            var str=dockerCl.substring(star+1,dockerCl.length);
            if(program.evn=='test'){
                dockerCl=dockerCl.replace(str,file.version+'-TEST-RELEASE');
                file.config['dockerBuildName']=dockerCl;
            }else{
                dockerCl=dockerCl.replace(str,file.version);
                file.config['dockerBuildName']=dockerCl;
            }
        }
        
    }
    
    // console.log(file.scripts);
    // if(!file.scripts['docker-build:test'] &&  !file.scripts['docker-build:prod'] && !file.scripts['docker-build:prod']){
    //     console.log('找不到docker-build参数');
    //     process.exit(1);
    // }else{
    //     if(program.evn=='test'){
    //         let dockerCl
    //         if (file.scripts['docker-build:test']){
    //             dockerCl=file.scripts['docker-build:test'];
    //             var x=dockerCl.indexOf(':');
    //             var star=dockerCl.indexOf(':',x+1);
    //             var end=dockerCl.indexOf(' ',star+1);
    //             var str=dockerCl.substring(star+1,end);
    //             dockerCl=dockerCl.replace(str,file.version+'-TEST-RELEASE');
    //             file.scripts['docker-build:test']=dockerCl;
    //         }else{
    //             dockerCl=file.scripts['docker-build'];
    //             var x=dockerCl.indexOf(':');
    //             var star=dockerCl.indexOf(':',x+1);
    //             var end=dockerCl.indexOf(' ',star+1);
    //             var str=dockerCl.substring(star+1,end);
    //             dockerCl=dockerCl.replace(str,file.version+'-TEST-RELEASE');
    //             file.scripts['docker-build']=dockerCl;
    //         };
    //     }else{
    //         let dockerCl
    //         if (file.scripts['docker-build:prod']){
    //             dockerCl=file.scripts['docker-build:prod'];
    //             var x=dockerCl.indexOf(':');
    //             var star=dockerCl.indexOf(':',x+1);
    //             var end=dockerCl.indexOf(' ',star+1);
    //             var str=dockerCl.substring(star+1,end);
    //             dockerCl=dockerCl.replace(str,file.version);
    //             file.scripts['docker-build:prod']=dockerCl;
    //         }else{
    //             dockerCl=file.scripts['docker-build'];
    //             var x=dockerCl.indexOf(':');
    //             var star=dockerCl.indexOf(':',x+1);
    //             var end=dockerCl.indexOf(' ',star+1);
    //             var str=dockerCl.substring(star+1,end);
    //             dockerCl=dockerCl.replace(str,file.version);
    //             file.scripts['docker-build']=dockerCl;
    //         };
    //     }
    // }
}
var destString = JSON.stringify(file,null, 2);
fs.writeFile(process.cwd()+'/package.json', destString,function(rs){
    console.log('change-version success!!!');
    process.exit(0);
});
