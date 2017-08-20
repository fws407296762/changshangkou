/**
 * Created by fws on 2017/8/1.
 */

/*
* 接口路由配置
* */

const express = require("express");
const router = express.Router();
const https = require("https");
const querystring = require("querystring");

//获取百度 access_token
router.get("/baidu/authorization",function(req,res){
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
router.get("/baidu/getLoggedInUser",function(req,res){
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

router.get("/baidu/getQuota",function(req,res){
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
router.get("/baidu/file/meta",function(req,res){
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
router.get("/baidu/file/mkdir",function(req,res){
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


module.exports = router;