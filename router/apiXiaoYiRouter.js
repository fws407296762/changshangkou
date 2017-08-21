/**
 * Created by fuwensong on 2017/8/21.
 */

//小蚁接口路由配置

const express = require("express");
const router = express.Router();
const https = require("https");

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
            "Content-Type":"application/x-www-form-urlencoded"
        }
    };
    let request = https.request(options,function(response){
        response.on("data",function(chunk){
            console.log(`BODY: ${chunk}`);
        });
        response.on("end",function(){

        })
    })
})