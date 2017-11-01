/**
 * Created by fws on 2017/8/1.
 */

const express = require("express");
const path = require("path");
const app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json({limit:'50mb'})); // for parsing application/json
app.use(bodyParser.urlencoded({limit:'50mb',extended: true })); // for parsing application/x-www-form-urlencoded
let pageRouter = require("./router/pageRouter.js");
let apiBaiduRouter = require("./router/apiBaiduRouter.js");
let apiXiaoYiRouter = require("./router/apiXiaoYiRouter.js");

app.engine("html",require("ejs").renderFile);
app.set("views",path.join(__dirname,"views"));
app.set("view engine","html");

app.use("/",pageRouter);
app.use("/api/baidu",apiBaiduRouter);
app.use("/api/xiaoyi",apiXiaoYiRouter);
let server = app.listen(8090,"www.changtangkou.com",function(){
    console.log("http://www.changtangkou.com服务已经开启")
});