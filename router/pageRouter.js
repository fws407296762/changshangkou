/**
 * Created by fws on 2017/8/1.
 */

//页面路由配置
const express = require("express");
const fs = require("fs");
let router = express.Router();

router.get("/",function(req,res){
    res.render("home",{
        title:"登陆百度账号"
    })
})

module.exports = router;