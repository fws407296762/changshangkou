/**
 * Created by fuwensong on 2017/8/21.
 */

//小蚁接口路由配置

const express = require("express");
const router = express.Router();
const querystring = require("querystring");
const http = require("http");
const https = require("https");
const url = require("url");
const fs = require("fs");
const EventEmitter = require('events');
let XYEvent = new EventEmitter();
let loginedLoaction = "",loginedCookie= "",loginedInitData = {};

//登陆到小蚁平台
router.post("/login",function(req,res){
    let query = req.query,
        headers = req.headers;
    let bodyData = querystring.stringify({
        "account":"17720440292",
        "password":"Lyq2512125"
    });
    let options = {
        protocol:"https:",
        host:"yun.xiaoyi.com",
        path:"/login",
        method:"POST",
        headers:{
            "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36",
            "Upgrade-Insecure-Requests":1,
            "Origin":"https://yun.xiaoyi.com",
            "Content-Type":"application/x-www-form-urlencoded",
            "Content-Length":Buffer.byteLength(bodyData)
        }
    };
    let request = https.request(options,function(response){
        let responseData = "";
        let responseHeaders = response.headers;
        response.on("data",function(chunk){
            responseData += chunk;
        });
        response.on("end",function(){
            console.log("小蚁登陆成功");
            loginedLoaction = responseHeaders.location;
            let setCookie = responseHeaders["set-cookie"];
            loginedCookie = setCookie.join(",").replace(/(HttpOnly)\;?\,?|(Secure)\;?\,?|(Path=\/)\;?\,?|\s*/g,"");
            res.send({
                code:0,
                msg:"登陆成功"
            })
        })
    });
    request.write(bodyData);
    request.end();
});

//跳到小蚁播放界面
router.get("/video",function(req,res){
    let locationUrl = url.parse(loginedLoaction);
    let options = {
        protocol:locationUrl.protocol,
        host:locationUrl.host,
        path:locationUrl.path,
        headers:{
            "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36",
            "Cookie":loginedCookie
        }
    };
    let request = https.request(options,function(response){
        let responseData = "";
        let responseHeaders = response.headers;
        console.log('进入Video')
        response.on("data",function(chunk){
            responseData += chunk;
        });
        response.on("end",function(){
            let oldResponseData = responseData,
                newResponseData = "",
                windowInitData = [];
            newResponseData = oldResponseData.replace(/[^\;](window)/g,";window");  //主要作用就是如果 window 前面没有 ; 则给 window 前面加上 ;
            newResponseData = newResponseData.replace(/[\s\r\n]/g,"");   //清除掉空格换行
            windowInitData = newResponseData.match(/((window)\.(initData)\.\w*\=([\[\{\"]?\S*?[\"\}\]]?)\;){1,}?/g);  //获取window.initData开头的数据
            windowInitData.forEach(function(item,index){
                item.replace(/(window\.initData\.\w*)\=(\S*)\;/,function(str,one,two){
                    loginedInitData[one] = eval("("+two+")");
                });
            });
            Object.assign(loginedInitData,{
                code:0,
                msg:"进入video"
            })
            res.send(loginedInitData)
        })
    });
    request.end();
});


//创建小蚁下载任务
router.post("/download/create",function(req,res){
    let body = req.body;
    let startTime = body.startTime * 1,
        stopTime = body.stopTime * 1
    console.log("任务的开始时间："+formttime(startTime),"任务的结束时间："+formttime(stopTime))
    let options = {
        protocol:"https:",
        host:"yun.xiaoyi.com",
        path:"/download/create",
        method:"POST",
        headers:{
            "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36",
            "Cookie":loginedCookie,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    // let bodyData = querystring.stringify({
    //     uid:loginedInitData["window.initData.currentUid"],
    //     startTime:startTime || loginedInitData["window.initData.startTime"],
    //     stopTime:stopTime || loginedInitData["window.initData.startTime"]
    // });

    let bodyData = querystring.stringify({
        uid:loginedInitData["window.initData.currentUid"],
        startTime:1504874763000,
        stopTime:1504874803000
    });
    let request = https.request(options,function(response){
        let responseData = "";
        let responseHeaders = response.headers;
        console.log('开始创建下载任务')
        response.on("data",function(chunk){
            console.log('正在创建下载任务...')
            responseData += chunk;
        });
        response.on("end",function(){
            console.log('创建任务成功',responseData)
            responseData = JSON.parse(responseData);
            res.send(responseData);
        })
    });
    request.write(bodyData);
    request.end();
});

let isStartUpload = false;
let fileChunkAry = [];
let uploadSize = 0;
XYEvent.on("getFileChunk",function(chunk,accesstoken){
    fileChunkAry.push(chunk);
    if(!uploadSize){
        uploadFileChunk(fileChunkAry,accesstoken);
    }
    uploadSize++;
});

function uploadFileChunk(chunks,accesstoken) {
    let chunksLen = chunks.length;
    if(!chunksLen){
        console.log("所有的 chunk 上传完成");
        uploadSize = 0;
        return false;
    }
    if(!isStartUpload){
        let firstChunk = chunks.splice(0,1)[0];
        isStartUpload = true;
        console.log("\r\n开始上传：",firstChunk);
        upTmpFile({
            chunk:firstChunk,
            accesstoken:accesstoken
        }).then(function(res){
            console.log("返回的信息：",res)
            console.log("上传结束：",firstChunk,"\r\n")
            isStartUpload = false;
            uploadFileChunk(fileChunkAry,accesstoken);
        });
    }
}

//下载小蚁任务
router.get("/download/file",function(req,res){
    let query = req.query;
    let accesstoken = query.accesstoken;
    let request = http.get("http://xiaoyi-stream.oss-cn-shanghai.aliyuncs.com/output/166e96c6-1c35-4c92-a3c2-bcd7da0ab98a.mp4?Expires=1505055600&OSSAccessKeyId=Pa0tZniM9vyAqqMn&Signature=0eDAWOmBaA%2BGxzJTWwGES/H2zys%3D",function(res){
        let fileBuffAry = [];
        let upladStatus = false;
        let fileContentLen = res.headers["content-length"];
        let minUploadChunk = Math.ceil(fileContentLen / 10);

        res.on("data",function(chunk){
            let chunkLen = chunk.length;
            fileBuffAry.push(chunk);
            let fileBuff = Buffer.concat(fileBuffAry);
            if(fileBuff.length >= minUploadChunk){
                console.log("=====开始上传文件 chunk ======",fileBuff,fileBuff.length)
                XYEvent.emit("getFileChunk",fileBuff,accesstoken);
                fileBuffAry = [];
            }
        });
        res.on("end",function(){
            console.log("下载完成");
        });
    });
});

function upTmpFile(options){
    let chunk = options.chunk,
        accesstoken = options.accesstoken;
    return new Promise(function(resolve,reject){
        let json = JSON.stringify(chunk);
        let bodyPost = JSON.stringify({
            file:JSON.parse(json),
            accesstoken:accesstoken
        });
        let options = {
            host:"www.changtangkou.com",
            protocol:"http:",
            path:"/api/baidu/file/upload/tmpfile",
            method:"POST",
            headers:{
                "X-Requested-With":"XMLHttpRequest",
                "Content-Type":"application/json",
                "Content-Length":bodyPost.length
            }
        };
        let baiduUploadRequest = http.request(options,function(response){
            let reeponseData = "";
            response.on("data",function(chunk){
                reeponseData += chunk
            });
            response.on("end",function(){
                resolve(reeponseData);
            })
        });
        baiduUploadRequest.write(bodyPost);
        baiduUploadRequest.end();
    })
}


function formttime(time){
    let date = new Date(time);
    let year = date.getFullYear(),
        month = date.getMonth() + 1,
        day = date.getDate(),
        hours = date.getHours(),
        minutes = date.getMinutes(),
        seconds = date.getSeconds();
    return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
}



module.exports = router;