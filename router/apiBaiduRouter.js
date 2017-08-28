/**
 * Created by fuwensong on 2017/8/21.
 */

/*
 * 百度网盘接口路由配置
 * */

const express = require("express");
const router = express.Router();
const https = require("https");
const querystring = require("querystring");
const fs = require("fs");
const path = require("path");
const stream = require("stream");
const util = require("util");

function postFile(fileKeyValue, req) {
    var boundaryKey = Math.random().toString(16);
    var enddata = '\r\n----' + boundaryKey + '--';

    var files = new Array();
    for (var i = 0; i < fileKeyValue.length; i++) {
        var content = '\r\n----' + boundaryKey + '\r\n' + 'Content-Type: application/octet-stream\r\n' + 'Content-Disposition: form-data; name=\'' + fileKeyValue[i].urlKey + '\'; filename=\'' + path.basename(fileKeyValue[i].urlValue) + '\'\r\n' + 'Content-Transfer-Encoding: binary\r\n\r\n';

        var contentBinary = new Buffer(content, 'utf-8');//当编码为ascii时，中文会乱码。
        files.push({contentBinary: contentBinary, filePath: fileKeyValue[i].urlValue});
    }
    var contentLength = 0;
    for (var i = 0; i<files.length; i++) {
        var stat = fs.statSync(files[i].filePath);
        contentLength += files[i].contentBinary.length;
        contentLength += stat.size;
    }
    req.setHeader('Content-Type', 'multipart/form-data; boundary=--' + boundaryKey);
    req.setHeader('Content-Length', contentLength + Buffer.byteLength(enddata));

    // 将参数发出
    var fileindex = 0;
    var doOneFile = function(){
        req.write(files[fileindex].contentBinary);
        var fileStream = fs.createReadStream(files[fileindex].filePath, {bufferSize : 4 * 1024});
        fileStream.pipe(req, {end: false});
        fileStream.on('end', function() {
            fileindex++;
            console.log(req)
            if(fileindex == files.length){

                req.end(enddata);
            } else {
                doOneFile();
            }
        });
    };

    if(fileindex == files.length){

        req.end(enddata);
    } else {
        doOneFile();
    }
}



//获取百度 access_token
router.get("/authorization",function(req,res){
    let query = req.query;
    let headers = req.headers;
    let bodyData = querystring.stringify({
        "grant_type":"authorization_code",
        "code":query.code,
        "client_id":"0upuII64N8q7tpTKrmYBaGFr",  //FileGee 的 ApiKey
        "client_secret":"Nia5GyvhsoS6eMZhgd6FIVPI2wyKFx6v",  //FileGee 的 SecretKey
        "redirect_uri":"oob"
    });
    let options = {
        host:"openapi.baidu.com",
        protocol:"https:",
        path:"/oauth/2.0/token",
        method:"POST",
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded',
            "x-requested-with":headers["x-requested-with"],
            'user-agent':headers['user-agent']
        }
    };
    let request = https.request(options,function(response){
        let responseData = "";
        response.on("data",function(chunk){
            responseData += chunk;
        });
        response.on("end",function(){
            responseData = JSON.parse(responseData);
            Object.assign(responseData,{
                code:0,
                msg:""
            });
            res.send(responseData);
        })
    });
    request.write(bodyData);
    request.end();
});


//获取百度个人信息
router.get("/getLoggedInUser",function(req,res){
    let query = req.query;
    let headers = req.headers;
    let options = {
        host:"openapi.baidu.com",
        protocol:"https:",
        path:"/rest/2.0/passport/users/getLoggedInUser",
        method:"POST",
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded',
            "x-requested-with":headers["x-requested-with"],
            'user-agent':headers['user-agent']
        }
    };
    let bodyData = querystring.stringify({
        "access_token":query.accesstoken
    });
    let request = https.request(options,function(response){
        let responseData = "";
        response.on("data",function(chunk){
            responseData += chunk;
        });
        response.on("end",function(){
            responseData = JSON.parse(responseData);
            Object.assign(responseData,{
                code:0,
                msg:""
            });
            res.send(responseData);
        })
    });
    request.write(bodyData);
    request.end();
});

//获取百度网盘空间

router.get("/getQuota",function(req,res){
    let query = req.query,
        headers = req.headers;
    let bodyData = querystring.stringify({
        method:"info",
        access_token:query.accesstoken
    });
    headers.host = "pcs.baidu.com";
    bodyData = "?"+bodyData;
    let options = {
        protocol:"https:",
        host:"pcs.baidu.com",
        path:"/rest/2.0/pcs/quota" + bodyData,
        method:"GET"
    };
    let request = https.request(options,function(response){
        let responseData = "";
        response.on("data",function(chunk){
            responseData += chunk;
        });
        response.on("end",function(){
            responseData = JSON.parse(responseData);
            Object.assign(responseData,{
                code:0,
                msg:""
            });
            res.send(responseData);
        })
    });
    request.end();
});

//获取单个文件或目录的元信息
router.get("/file/meta",function(req,res){
    let query = req.query,
        headers = req.headers;

    let bodyData = querystring.stringify({
        method:"meta",
        access_token:query.accesstoken,
        path:"/apps/FileGee文件同步备份系统/"
    });
    bodyData = "?"+bodyData;
    let options = {
        protocol:"https:",
        host:"pcs.baidu.com",
        path:"/rest/2.0/pcs/file"+bodyData,
        method:"GET"
    };
    let request = https.request(options,function(response){
        let responseData = "";
        response.on("data",function(chunk){
            responseData += chunk;
        });
        response.on("end",function(){
            responseData = JSON.parse(responseData);
            Object.assign(responseData,{
                code:0,
                msg:""
            });
            res.send(responseData);
        });
    });
    request.end();
});

//为当前用户创建一个目录
router.get("/file/mkdir",function(req,res){
    let query = req.query,
        headers = req.headers;

    let bodyData = querystring.stringify({
        method:"mkdir",
        access_token:query.accesstoken,
        path:"/apps/FileGee文件同步备份系统/"
    });

    let options = {
        protocol:"https:",
        host:"pcs.baidu.com",
        path:"/rest/2.0/pcs/file?"+bodyData,
        method:"POST"
    };

    let request = https.request(options,function(response){
        console.log("开始创建")
        let responseData = "";
        response.setEncoding('utf8');
        response.on("data",function(chunk){
            console.log("正在创建...")
            responseData += chunk;
        });
        response.on("end",function(){
            console.log("创建结束")
            responseData = JSON.parse(responseData);
            Object.assign(responseData,{
                code:0,
                msg:""
            });
            res.send(responseData);
        });
    });

    request.on("error",function(e){
        console.log(e)
    });
    request.end();
});

// 上传单个文件
router.post("/file/upload",function(req,res){
    let query = req.query,
        headers = req.headers,
        body = req.body;
    let bodyData = querystring.stringify({
        file:fs.readFileSync('./upload/1.txt',"utf8")
    });
    var fileContent = fs.readFileSync('./upload/1.txt',"utf8");
    var files = [
        {urlKey:"file",urlValue:"./upload/2.txt"}
    ];

    let options = {
        host:"pcs.baidu.com",
        protocol:"https:",
        path:"/rest/2.0/pcs/file?method=upload&access_token="+body.accesstoken+"&path=%2Fapps%2FFileGee%E6%96%87%E4%BB%B6%E5%90%8C%E6%AD%A5%E5%A4%87%E4%BB%BD%E7%B3%BB%E7%BB%9F%2F%E5%A5%BD%E5%90%A7.mp3&ondup=newcopy",
        method:"POST"
    };

    let request = https.request(options,function(response){
        console.log("执行进来...")
        let responseData = "";
        response.on("data",function(chunk){
            responseData += chunk;
        });
        response.on("end",function(){
            console.log(responseData);
            responseData = JSON.parse(responseData);
            res.send(responseData);

        });
    });
    postFile(null,request);
});

//为当前用户创建一个目录
router.get("/file/search",function(req,res){
    let query = req.query,
        headers = req.headers;

    let bodyData = querystring.stringify({
        method:"search",
        access_token:query.accesstoken,
        path:"/apps/FileGee文件同步备份系统/",
        wd:"1",
        re:"1"
    });

    let options = {
        protocol:"https:",
        host:"pcs.baidu.com",
        path:"/rest/2.0/pcs/file?"+bodyData,
        method:"GET"
    };

    let request = https.request(options,function(response){
        let responseData = "";
        response.setEncoding('utf8');
        response.on("data",function(chunk){
            responseData += chunk;
        });
        response.on("end",function(){
            responseData = JSON.parse(responseData);
            Object.assign(responseData,{
                code:0,
                msg:""
            });
            res.send(responseData);
        });
    });

    request.on("error",function(e){
        console.log(e)
    });
    request.end();
});

//下载文件
router.get("/file/download",function(req,res){
    let query = req.query,
        headers = req.headers;

    let bodyData = querystring.stringify({
        method:"download",
        access_token:query.accesstoken,
        path:"/apps/FileGee文件同步备份系统/好吧_20170821162506.txt"
    });

    let options = {
        protocol:"https:",
        host:"d.pcs.baidu.com",
        path:"/rest/2.0/pcs/file?"+bodyData,
        method:"GET"
    };

    let request = https.request(options,function(response){
        let responseData = "";
        response.setEncoding('utf8');
        response.on("data",function(chunk){
            responseData += chunk;
        });
        response.on("end",function(){
            responseData = JSON.parse(responseData);
            Object.assign(responseData,{
                code:0,
                msg:""
            });
            res.send(responseData);
        });
    });

    request.on("error",function(e){
        console.log(e)
    });
    request.end();
});

module.exports = router;