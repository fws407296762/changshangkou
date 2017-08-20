/**
 * Created by fws on 2017/8/1.
 */

const express = require("express");
const path = require("path");
const app = express();
let pageRouter = require("./router/pageRouter.js");
let apiRouter = require("./router/apiRouter.js");

app.engine("html",require("ejs").renderFile);
app.set("views",path.join(__dirname,"views"));
app.set("view engine","html");

app.use("/",pageRouter);
app.use("/api",apiRouter);
app.listen(80,"www.changtangkou.com",function(){
    console.log("http://www.changtangkou.com服务已经开启")
});