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
    .option('-short, --short [short]', 'your project short', '')
program.parse(process.argv)
file.version=program.sv;
if(program.short){
    const cityData=require('./city.json');
    let city;
    for(let item of cityData){
        if(item['short']==program.short){
            city=item;
            break;
        }
    }
    let data=fs.readFileSync(process.cwd()+'/src/providers/api.ts','utf8');
    const fileUrlStar= data.indexOf("export const fileUrl = 'https://www.libab.cn/wx-");
    const fileUrlEnd= data.indexOf("/';",fileUrlStar+1);
    const fileUrl=data.substring(fileUrlStar,fileUrlEnd);
    const hostUrlStar=data.indexOf("export const hostUrl = 'https://chinapopin.com/rkw-wh");
    const hostUrlEnd= data.indexOf("/';",hostUrlStar+1);
    const hostUrl=data.substring(hostUrlStar,hostUrlEnd);
    if(program.evn=='test'){
        data=data.replace(hostUrl,"export const hostUrl = 'https://chinapopin.com/rkw-whz-test");
        data=data.replace(fileUrl,"export const fileUrl = 'https://www.libab.cn/wx-"+program.short+'whz-test');
    }else{
        data=data.replace(fileUrl,"export const fileUrl = 'https://www.libab.cn/wx-"+program.short+'whz');
        data=data.replace(hostUrl,"export const hostUrl = 'https://chinapopin.com/rkw-whz");
    }
    const prefixStar= data.indexOf("export const prefix = '");
    const prefixEnd= data.indexOf("-';",prefixStar+1);
    const prefix=data.substring(prefixStar,prefixEnd);
    data=data.replace(prefix,"export const prefix = '"+program.short);
    const cIdStar= data.indexOf("'cId':'");
    const cIdEnd= data.indexOf("',",cIdStar+1);
    const cId=data.substring(cIdStar,cIdEnd);
    data=data.replace(cId,"'cId':'"+city.cId);
    const cNameStar= data.indexOf("'cName':'");
    const cNameEnd= data.indexOf("'",cNameStar+10);
    const cName=data.substring(cNameStar,cNameEnd);
    data=data.replace(cName,"'cName':'"+city.name);
    fs.writeFile(process.cwd()+'/src/providers/api.ts', data ,(err, data)=>{
        console.log('============================================================================');
        console.log('============================api.ts change success!!!=============================');
        console.log('============================================================================');
        console.log('============================================================================');
    });
    
}
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
}
var destString = JSON.stringify(file,null, 2);
fs.writeFile(process.cwd()+'/package.json', destString,function(rs){
    if(program.short){
        console.log('============================================================================');
        console.log('============================================================================');
        console.log('============================'+dockerCl+'=============================');
        console.log('============================================================================');
        console.log('============================================================================');
    }
    console.log('change-version success!!!');
    process.exit(0);
});
